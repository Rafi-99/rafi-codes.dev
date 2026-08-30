import 'server-only';
import { NextResponse } from 'next/server';
import { rejectIfUnauthorized, getPasswordHash, setPasswordHash, hashPassword, verifyPassword, isValidPassword, invalidateAllCredentials, setSessionCookie, isRateLimited, recordFailedAttempt, clearRateLimit, getClientIp } from '@utils/admin/Auth';

export async function POST(request) {
    const unauthorized = await rejectIfUnauthorized(request);

    if (unauthorized) {
        return unauthorized;
    };

    const ip = getClientIp(request);

    if (await isRateLimited('change-password', ip)) {
        return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }

    const { currentPassword, newPassword, confirmPassword } = await request.json().catch(() => ({}));

    if (!isValidPassword(newPassword, confirmPassword)) {
        return NextResponse.json({ error: 'Passwords must match and be 12 characters long' }, { status: 400 });
    }

    const currentHash = await getPasswordHash();
    const currentValid = currentHash && typeof currentPassword === 'string' && (await verifyPassword(currentHash, currentPassword));

    if (!currentValid) {
        await recordFailedAttempt('change-password', ip);
        return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
    }

    const newHash = await hashPassword(newPassword);
    await setPasswordHash(newHash);
    await invalidateAllCredentials();
    await clearRateLimit('change-password', ip);

    const response = NextResponse.json({ ok: true });

    return await setSessionCookie(response);
}
