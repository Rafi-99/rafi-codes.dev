import 'server-only';
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
    const client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
    const url = client.generateAuthUrl({ access_type: 'online', scope: ['openid', 'email'], prompt: 'select_account' });

    return NextResponse.redirect(url);
}
