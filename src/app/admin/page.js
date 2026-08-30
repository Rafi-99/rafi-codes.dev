import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SESSION_COOKIE, verifySessionToken } from '@utils/admin/Auth';
import AdminForm from '@components/admin/AdminForm';
import TerminalWindow from '@components/shared/TerminalWindow';
import styles from '@styles/page/admin-home.module.css';

export const metadata = {
    title: 'Admin',
    robots: { index: false, follow: false }
};

export default async function AdminLogin({ searchParams }) {
    const cookieStore = await cookies();

    if (await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)) {
        redirect('/admin/dashboard');
    }

    const params = await searchParams;
    const errorMessage = params?.error === 'unauthorized' ? 'That Google account is not authorized for admin access.' : params?.error === 'google' ? 'Google sign-in failed. Try again.' : params?.error === 'ratelimited' ? 'Too many attempts. Try again later.' : null;

    return (
        <div className='page-wrapper'>
            <div className={styles.intro}><p className='prompt-line'><span className='prompt-symbol'>$</span> su root</p></div>
            <TerminalWindow title='rafi@codes: ~' className={styles.terminal}>
                <div className={styles.card}>
                    <p>Welcome back. Please sign in.</p>
                    <AdminForm fields={[{ name: 'email', type: 'email', placeholder: 'Email', autoComplete: 'username' }, { name: 'password', type: 'password', placeholder: 'Password', autoComplete: 'current-password' }]} endpoint='/api/admin/auth/login' submitLabel='Log in' loadingLabel='Checking...' redirectTo='/admin/dashboard' initialError={errorMessage} />
                    <Link href='/api/admin/auth/google' className='pushable accent'>Sign in with Google</Link>
                    <Link href='/admin/forgot-password' className={styles.forgot}>Forgot password?</Link>
                </div>
            </TerminalWindow>
        </div>
    );
}
