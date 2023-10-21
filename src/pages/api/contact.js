import { google } from 'googleapis';
import { createTransport } from 'nodemailer';

const client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

export default async function handler(request, response) {
    const { name, email, message, token } = request.body;

    const isValidRequest = () => {
        const invalidInput = (input) => input === null || input === undefined || input === '';
        return !invalidInput(name) && !invalidInput(email) && !invalidInput(message) && !invalidInput(token);
    };

    if (request.method === 'POST' && isValidRequest()) {
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

        const tokenValidator = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ secret: process.env.RECAPTCHA_SECRET_KEY, response: token })
        });

        const { success, score } = await tokenValidator.json();

        try {
            if (success && score > 0.5) {
                await transporter.sendMail({
                    from: email,
                    to: 'contact@rafi-codes.dev',
                    subject: 'Contact Form Response | Rafi Codes',
                    text: `${message}\n⸻\nName: ${name}\nEmail: ${email}`
                }).then((result) => {
                    response.status(200).json({ success: result });
                });
            }

            else {
                response.status(500).json({ error: 'Invalid Token' });
            }
        }

        catch (error) {
            response.status(500).json({ error });
        }
    }

    else if (request.method !== 'POST') {
        response.status(405).json({ error: `Method ${request.method} is not allowed.` });
    }

    else {
        response.status(400).json({ error: 'Please try again with a valid POST request.' });
    }
};
