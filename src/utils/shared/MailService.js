import 'server-only';
import { createTransport } from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';

// Every outbound call is bounded, so one slow dependency can't eat the whole function budget and surface as a Vercel timeout.
const TOKEN_TIMEOUT_MS = 5000;
const SMTP_TIMEOUT_MS = 7000;

const client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function withTimeout(promise, ms, message) {
    let timer;

    const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(message)), ms);
    });

    return Promise.race([ promise, timeout ]).finally(() => clearTimeout(timer));
}

async function getAccessToken() {
    // getAccessToken() resolves to { token, res }, but nodemailer needs the token string. Passing the object makes XOAUTH2 send "[object Object]" and Gmail drops the connection.
    const { token } = await withTimeout(client.getAccessToken(), TOKEN_TIMEOUT_MS, 'Timed out while refreshing the Gmail access token.');

    if (!token) {
        throw new Error('Gmail access token refresh returned no token.');
    }

    return token;
}

export async function sendMail({ from, to, subject, text }) {
    const transporter = createTransport({
        service: 'gmail',
        connectionTimeout: SMTP_TIMEOUT_MS,
        greetingTimeout: SMTP_TIMEOUT_MS,
        socketTimeout: SMTP_TIMEOUT_MS,
        auth: {
            type: 'OAuth2',
            user: process.env.USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: await getAccessToken()
        }
    });

    return transporter.sendMail({ from, to, subject, text });
}

export async function checkGmailAuth() {
    try {
        // Loaded lazily: googleapis pulls in every Google API surface, which the contact route would otherwise pay for on every cold start.
        const { google } = await import('googleapis');
        const gmail = google.gmail({ version: 'v1', auth: client });
        const profile = await gmail.users.getProfile({ userId: 'me' });
        return {
            ok: !!profile?.data?.emailAddress
        };
    }
    catch (error) {
        console.error('Gmail health check failed:', error.message);
        return {
            ok: false
        };
    }
}
