import { verifyResetToken } from '@utils/admin/Auth';
import AdminForm from '@components/admin/AdminForm';
import styles from '@styles/page/admin-home.module.css';

export const metadata = {
    title: 'Reset Password',
    robots: { index: false, follow: false }
};

export default async function ResetAdminPassword({ searchParams }) {
    const params = await searchParams;
    const token = params?.token;
    const valid = token ? await verifyResetToken(token) : false;

    return (
        <div className='page-wrapper'>
            <div className={styles.card}>
                <p className='prompt-line'><span className='prompt-symbol'>$</span> passwd</p>

                {valid ? (
                        <AdminForm
                            fields={[
                                { name: 'newPassword', type: 'password', placeholder: 'new password', autoComplete: 'new-password' },
                                { name: 'confirmPassword', type: 'password', placeholder: 'confirm new password', autoComplete: 'new-password' }
                            ]}
                            endpoint='/api/admin/auth/reset-password' hiddenFields={{ token }} submitLabel='Set New Password' loadingLabel='Resetting...' successMessage='Your password has been reset.' redirectTo='/admin' redirectDelayMs={5000}
                        />
                    )
                    :
                    (<p className={styles.error}>This reset link is invalid or has expired. Request a new one from the login page.</p>)
                }
            </div>
        </div>
    );
}
