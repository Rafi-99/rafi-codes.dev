import 'server-only';
import { google } from 'googleapis';
import { createTransport } from 'nodemailer';

const client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

export async function sendMail({ from, to, subject, text }) {
    const transporter = createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: await client.getAccessToken()
        }
    });

    return transporter.sendMail({ from, to, subject, text });
}

export async function checkGmailAuth() {
    try {
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
