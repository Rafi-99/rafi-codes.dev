import 'server-only';
import { NextResponse } from 'next/server';
import { setSessionCookie, safeEqual, verifyPassword, getPasswordHash, isRateLimited, recordFailedAttempt, clearRateLimit, getClientIp } from '@utils/admin/Auth';

export async function POST(request) {
    try {
        const ip = getClientIp(request);

        if (await isRateLimited('login', ip)) {
            return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
        }

        const { email, password } = await request.json().catch(() => ({}));
        const expectedEmail = process.env.USER;
        const expectedHash = await getPasswordHash();

        if (!expectedEmail || !expectedHash) {
            return NextResponse.json({ error: 'Server not configured.' }, { status: 500 });
        }

        const validEmail = typeof email === 'string' && safeEqual(email, expectedEmail);
        const validPassword = typeof password === 'string' && (await verifyPassword(expectedHash, password));

        if (!validEmail || !validPassword) {
            await recordFailedAttempt('login', ip);

            return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 });
        }

        await clearRateLimit('login', ip);
        const response = NextResponse.json({ ok: true });

        return await setSessionCookie(response);
    }
    catch (error) {
        console.error('Admin login failed:', error);

        return NextResponse.json({ error: 'Login failed. Check server logs.' }, { status: 500 });
    }
}
