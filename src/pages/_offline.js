import styles from '../styles/pages/_offline.module.css';

export default function Offline() {
    return (
        <>
            <div className={styles.container}>
                <h1>Oops!</h1>
                <p>It looks like you are offline.</p>
            </div>
        </>
    );
};