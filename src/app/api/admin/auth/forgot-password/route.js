import 'server-only';
import { NextResponse } from 'next/server';
import { safeEqual, createResetToken, isRateLimited, recordFailedAttempt, getClientIp } from '@utils/admin/Auth';
import { sendMail } from '@utils/shared/MailService';

export async function POST(request) {
    const ip = getClientIp(request);

    if (await isRateLimited('forgot-password', ip)) {
        return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }

    await recordFailedAttempt('forgot-password', ip);

    const { email } = await request.json().catch(() => ({}));
    const isAdminEmail = typeof email === 'string' && safeEqual(email, process.env.USER);

    if (isAdminEmail) {
        const token = await createResetToken();
        const resetUrl = `${process.env.SITE_URL}/admin/reset-password?token=${token}`;

        try {
            await sendMail({
                from: process.env.USER,
                to: process.env.USER,
                subject: 'Password Reset | Rafi Codes Admin',
                text: `A password reset was requested for your admin panel.\n\nClick on the link below to reset your password (expires in 15 minutes):\n${resetUrl}\n\nIf you did not request this, you can safely ignore this email — your password will not change unless the link above is used.`
            });
        }
        catch (error) {
            console.error('Failed to send password reset email:', error);
        }
    }
    else {
        console.log('Password reset attempted for unrecognized email:', email);
    }

    // Same response whether or not the email matched — never reveals whether an account exists.
    return NextResponse.json({ ok: true });
}
