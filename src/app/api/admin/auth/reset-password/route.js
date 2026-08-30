import 'server-only';
import { NextResponse } from 'next/server';
import { verifyResetToken, consumeResetToken, hashPassword, setPasswordHash, isValidPassword, invalidateAllCredentials } from '@utils/admin/Auth';

export async function POST(request) {
    const { token, newPassword, confirmPassword } = await request.json().catch(() => ({}));

    if (!(await verifyResetToken(token))) {
        return NextResponse.json({ error: 'This reset link is invalid or expired.' }, { status: 400 });
    }

    if (!isValidPassword(newPassword, confirmPassword)) {
        return NextResponse.json({ error: 'Passwords must match and be 12 characters long' }, { status: 400 });
    }

    const hash = await hashPassword(newPassword);
    await setPasswordHash(hash);
    await consumeResetToken(token);
    await invalidateAllCredentials();

    return NextResponse.json({ ok: true });
}
