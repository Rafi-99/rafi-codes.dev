import Link from 'next/link';
import { logoutAction } from '@app/admin/actions';
import { redirectIfUnauthenticated } from '@utils/admin/Auth';
import styles from '@styles/page/admin-dashboard.module.css';

export const metadata = {
    title: 'Admin Settings',
    robots: { index: false, follow: false }
};

export default async function AdminSettings() {
    await redirectIfUnauthenticated();

    return (
        <div className={`page-flex ${styles.wrapper}`}>
            <p className='prompt-line'><span className='prompt-symbol'>$</span> cat settings.conf</p>
            <div className={styles.list}>
                <Link href='/admin/dashboard/settings/change-password' className='pushable accent'>Change Password</Link>
                <form action={logoutAction}>
                    <button type='submit' className='pushable accent'>$ logout</button>
                </form>
            </div>
        </div>
    );
}
