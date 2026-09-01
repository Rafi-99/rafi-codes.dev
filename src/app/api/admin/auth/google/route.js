import 'server-only';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const PKCE_COOKIE = 'google_oauth_pkce';
const STATE_COOKIE = 'google_oauth_state';
const COOKIE_TTL_SECONDS = 5 * 60; // 5 minutes — plenty to complete a login

export async function GET() {
    const client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
    const state = crypto.randomBytes(32).toString('hex');
    const { codeVerifier, codeChallenge } = await client.generateCodeVerifierAsync();
    const url = client.generateAuthUrl({ access_type: 'online', scope: [ 'openid', 'email' ], prompt: 'select_account', state, code_challenge: codeChallenge, code_challenge_method: 'S256'});

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Must survive the cross-site redirect back from accounts.google.com
        path: '/',
        maxAge: COOKIE_TTL_SECONDS,
    };

    const response = NextResponse.redirect(url);
    response.cookies.set(PKCE_COOKIE, codeVerifier, cookieOptions);
    response.cookies.set(STATE_COOKIE, state, cookieOptions);

    return response;
}
