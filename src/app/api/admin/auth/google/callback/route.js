import 'server-only';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { setSessionCookie, isRateLimited, recordFailedAttempt, getClientIp } from '@utils/admin/Auth';

export async function GET(request) {
    const ip = getClientIp(request);

    if (await isRateLimited('login', ip)) {
        return NextResponse.redirect(new URL('/admin?error=rate_limited', request.url));
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.redirect(new URL('/admin?error=google', request.url));
    }

    const client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);

    try {
        const { tokens } = await client.getToken(code);
        const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: process.env.CLIENT_ID });
        const payload = ticket.getPayload();

        if (payload?.email !== process.env.USER || !payload?.email_verified) {
            await recordFailedAttempt('login', ip);

            return NextResponse.redirect(new URL('/admin?error=unauthorized', request.url));
        }

        const response = NextResponse.redirect(new URL('/admin/dashboard', request.url));

        // 'lax', not the default 'strict' — this cookie has to survive a cross-site redirect landing here from accounts.google.com.
        return await setSessionCookie(response, 'lax');
    }
    catch (error) {
        console.error('Google sign-in failed:', error);

        return NextResponse.redirect(new URL('/admin?error=google', request.url));
    }
}
