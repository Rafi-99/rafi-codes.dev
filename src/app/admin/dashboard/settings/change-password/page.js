import { redirectIfUnauthenticated } from '@utils/admin/Auth';
import AdminForm from '@components/admin/AdminForm';
import styles from '@styles/page/admin-dashboard.module.css';

export const metadata = {
    title: 'Change Password',
    robots: { index: false, follow: false }
};

export default async function ChangeAdminPassword() {
    await redirectIfUnauthenticated();

    return (
        <div className={`page-flex ${styles.wrapper}`}>
            <p className='prompt-line'><span className='prompt-symbol'>$</span> passwd</p>

            <div className={styles.list}>
                <AdminForm fields={[
                    { name: 'currentPassword', type: 'password', placeholder: 'Current Password', autoComplete: 'current-password' },
                    { name: 'newPassword', type: 'password', placeholder: 'New Password', autoComplete: 'new-password' },
                    { name: 'confirmNewPassword', type: 'password', placeholder: 'Confirm New Password', autoComplete: 'new-password' }
                ]} endpoint='/api/admin/auth/change-password' submitLabel='Change Password' loadingLabel='Updating...' successMessage='Password changed. Logged out of all sessions.' />
            </div>
        </div>
    );
}
