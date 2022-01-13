import { google } from 'googleapis';
import nodemailer from 'nodemailer';

const client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const accessToken = await client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'rafi.md.2018@gmail.com',
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        try {
            await transporter
                .sendMail({
                    from: 'rafi.md.2018@gmail.com',
                    to: 'rafi.md.2018@gmail.com',
                    subject: 'Portfolio Contact Form Response',
                    text: `${req.body.message}\n\n--\nName: ${req.body.name}\nEmail: ${req.body.email}`
                })
                .then((result) => {
                    res.status(200).json(req.body);
                    console.log(result);
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).json(error);
                });
        }
        catch (error) {
            return error;
        }
    }
    else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};