import styles from '@styles/page/offline.module.css';

export const metadata = {
    title: 'Offline',
    robots: { index: false, follow: false },
};

export default function Offline() {
    return (
        <div className={styles.wrapper}>
            <p className={styles.code}>$ ping rafi-codes.dev</p>
            <h1>No Connection</h1>
            <p>It looks like you&apos;re offline. Please try again.</p>
        </div>
    );
};
