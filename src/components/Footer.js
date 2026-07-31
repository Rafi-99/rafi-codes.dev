import Link from 'next/link';
import { FaSquareGithub, FaLinkedin } from 'react-icons/fa6';
import styles from '@styles/component/Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <small>
                <span className={styles.comment}>{'# '}</span>Developed by Rafi —
                <span className={styles.copy}> &copy;</span> {new Date().getFullYear()}
            </small>
            <div className={styles.icons}>
                <Link href="https://www.github.com/Rafi-99/" rel="noopener noreferrer" target="_blank" aria-label="Link to Rafi's GitHub"><FaSquareGithub /></Link>
                <Link href="https://www.linkedin.com/in/rafi2018/" rel="noopener noreferrer" target="_blank" aria-label="Link to Rafi's LinkedIn"><FaLinkedin /></Link>
            </div>
        </footer>
    );
}
