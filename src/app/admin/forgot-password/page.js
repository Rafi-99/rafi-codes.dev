'use client';

import Link from 'next/link';
import AdminForm from '@components/admin/AdminForm';
import styles from '@styles/page/admin-home.module.css';

export default function ForgotAdminPassword() {
    return (
        <div className='page-wrapper'>
            <div className={styles.card}>
                <p className='prompt-line'><span className='prompt-symbol'>$</span> passwd</p>
                <AdminForm fields={[{ name: 'email', type: 'email', placeholder: 'email', autoComplete: 'username' }]} endpoint='/api/admin/auth/forgot-password' submitLabel='Send password reset link' loadingLabel='Sending...' successMessage='If that address is registered, a reset link is on its way.'/>
                <Link href='/admin' className={styles.forgot}>← Log in</Link>
            </div>
        </div>
    );
}
