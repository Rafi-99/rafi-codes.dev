'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, revokeSession } from '@utils/admin/Auth';

export async function logoutAction() {
    const cookieStore = await cookies();
    await revokeSession(cookieStore.get(SESSION_COOKIE)?.value);
    cookieStore.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
    redirect('/admin');
}
