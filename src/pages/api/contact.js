import { google } from 'googleapis';
import { createTransport } from 'nodemailer';

const client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

export default async function handler(req, res) {
    const validRequest = () => {
        const { name, email, message, token } = req.body;
        const badInput = null || undefined || '';
        return name !== badInput && email !== badInput && message !== badInput && token !== badInput;
    };

    if (req.method === 'POST' && validRequest()) {
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

        const validateToken = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ secret: process.env.RECAPTCHA_SECRET_KEY, response: req.body.token })
        });

        const { success, score } = await validateToken.json();

        try {
            if (success && score > 0.5) {
                await transporter.sendMail({
                    from: req.body.email,
                    to: 'contact@rafi-codes.dev',
                    subject: 'Contact Form Response | Rafi Codes',
                    text: `${req.body.message}\n\n--\nName: ${req.body.name}\nEmail: ${req.body.email}`
                }).then((result) => {
                    res.status(200).json({ success: result });
                });
            }
            else {
                res.status(500).json({ error: 'Invalid Token' });
            }
        }
        catch (error) {
            res.status(500).json({ error });
        }
    }
    else {
        res.status(405).json({ error: 'Please try again with a valid POST request.' });
    }
};