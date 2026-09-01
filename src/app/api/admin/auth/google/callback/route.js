import 'server-only';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { setSessionCookie, isRateLimited, recordFailedAttempt, getClientIp, safeEqual } from '@utils/admin/Auth';

const PKCE_COOKIE = 'google_oauth_pkce';
const STATE_COOKIE = 'google_oauth_state';

function clearOAuthCookies(response) {
    response.cookies.set(PKCE_COOKIE, '', { path: '/', maxAge: 0 });
    response.cookies.set(STATE_COOKIE, '', { path: '/', maxAge: 0 });

    return response;
}

export async function GET(request) {
    const ip = getClientIp(request);

    if (await isRateLimited('login', ip)) {
        return clearOAuthCookies(NextResponse.redirect(new URL('/admin?error=rate_limited', request.url)));
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const returnedState = searchParams.get('state');
    const expectedState = request.cookies.get(STATE_COOKIE)?.value;
    const codeVerifier = request.cookies.get(PKCE_COOKIE)?.value;

    /**
     * Reject if there's no stored state/verifier to compare against, no
     * returned state at all, or the two don't match — this is what stops
     * a forged/replayed callback request from being accepted as a
     * genuine, self-initiated login flow.
     */
    if (!expectedState || !returnedState || !safeEqual(returnedState, expectedState) || !codeVerifier) {
        await recordFailedAttempt('login', ip);

        return clearOAuthCookies(NextResponse.redirect(new URL('/admin?error=google', request.url)));
    }

    if (!code) {
        return clearOAuthCookies(NextResponse.redirect(new URL('/admin?error=google', request.url)));
    }

    const client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);

    try {
        const { tokens } = await client.getToken({ code, codeVerifier });
        const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: process.env.CLIENT_ID });
        const payload = ticket.getPayload();

        if (payload?.email !== process.env.USER || !payload?.email_verified) {
            await recordFailedAttempt('login', ip);

            return clearOAuthCookies(NextResponse.redirect(new URL('/admin?error=unauthorized', request.url)));
        }

        const response = NextResponse.redirect(new URL('/admin/dashboard', request.url));
        await setSessionCookie(response, 'lax');

        return clearOAuthCookies(response);
    }
    catch (error) {
        console.error('Google sign-in failed:', error);

        return clearOAuthCookies(NextResponse.redirect(new URL('/admin?error=google', request.url)));
    }
}
