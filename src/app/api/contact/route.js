import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createTransport } from 'nodemailer';

const client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const invalidInput = (input) => input === null || input === undefined || input === '';

async function sendMail({ name, email, message, subject }) {
    const transporter = createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: await client.getAccessToken(),
        },
    });

    return transporter.sendMail({
        from: email,
        to: process.env.SITE_EMAIL,
        subject,
        text: `${message}\n\u2e3b\nName: ${name}\nEmail: ${email}`,
    });
};

export async function POST(request) {
    const { name, email, message, token } = await request.json();

    if (invalidInput(name) || invalidInput(email) || invalidInput(message) || invalidInput(token)) {
        return NextResponse.json({ error: 'Please try again with a valid request.' }, { status: 400 });
    }

    try {
        const tokenValidator = await fetch(`https://recaptchaenterprise.googleapis.com/v1/projects/${process.env.RECAPTCHA_PROJECT_ID}/assessments?key=${process.env.RECAPTCHA_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event: {
                    token,
                    siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
                    expectedAction: 'submit',
                },
            }),
        });

        const { tokenProperties, riskAnalysis } = await tokenValidator.json();

        if (!tokenProperties?.valid || riskAnalysis?.score <= 0.5) {
            return NextResponse.json({ error: 'Invalid Token' }, { status: 500 });
        }

        const result = await sendMail({ name, email, message, subject: 'Contact Form Response | Rafi Codes' });
        return NextResponse.json({ success: result }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong while sending your message.' }, { status: 500 });
    }
};

// Vercel Cron pings this route weekly as a health check for the mail pipeline.
export async function GET(request) {
    const isCronRequest = request.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`;

    if (!isCronRequest) {
        return NextResponse.json({ error: 'Method GET is not allowed.' }, { status: 405 });
    }

    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const message = searchParams.get('message');

    if (invalidInput(name) || invalidInput(email) || invalidInput(message)) {
        return NextResponse.json({ error: 'Please try again with a valid request.' }, { status: 400 });
    }

    try {
        const result = await sendMail({ name, email, message, subject: 'Test Contact Form Response | Rafi Codes' });
        return NextResponse.json({ success: result }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong sending the test message.' }, { status: 500 });
    }
};
