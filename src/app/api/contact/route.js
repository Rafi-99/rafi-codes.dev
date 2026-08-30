import { NextResponse } from 'next/server';
import { sendMail } from '@utils/shared/MailService';
import { callRecaptchaAssessment } from '@utils/shared/Recaptcha';

const invalidInput = (input) => input === null || input === undefined || input === '';

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
        const result = await sendMail({
            from: email,
            to: process.env.SITE_EMAIL,
            subject: 'Test Contact Form Response | Rafi Codes',
            text: message,
        });
        return NextResponse.json({ success: result }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong sending the test message.' }, { status: 500 });
    }
}

// Contact form hits this route via POST.
export async function POST(request) {
    const { name, email, message, token } = await request.json();

    if (invalidInput(name) || invalidInput(email) || invalidInput(message) || invalidInput(token)) {
        return NextResponse.json({ error: 'Please try again with a valid request.' }, { status: 400 });
    }

    try {
        const assessment = await callRecaptchaAssessment(token);

        if (!assessment?.tokenProperties?.valid || assessment?.riskAnalysis?.score <= 0.5) {
            return NextResponse.json({ error: 'Invalid Token' }, { status: 500 });
        }

        const result = await sendMail({
            from: email,
            to: process.env.SITE_EMAIL,
            subject: 'Contact Form Response | Rafi Codes',
            text: `${message}\n⸻\nName: ${name}\nEmail: ${email}`,
        });
        return NextResponse.json({ success: result }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Something went wrong while sending your message.' }, { status: 500 });
    }
}
