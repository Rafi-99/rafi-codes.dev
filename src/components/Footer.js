import Link from 'next/link';
import { FaFacebookSquare, FaGithubSquare, FaInstagramSquare, FaLinkedin } from 'react-icons/fa';
import styles from '../styles/components/Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <small>Designed by Rafi | &copy; {new Date().getFullYear()}</small>
            <div className={styles.icons}>
                <Link href='https://www.facebook.com/rafi2022/'><a rel='noopener noreferrer' target='_blank' aria-label='Link to Rafi&apos;s Facebook'><FaFacebookSquare /></a></Link>
                <Link href='https://www.github.com/Rafi-99/'><a rel='noopener noreferrer' target='_blank' aria-label='Link to Rafi&apos;s GitHub'><FaGithubSquare /></a></Link>
                <Link href='https://www.instagram.com/runner_rafi/'><a rel='noopener noreferrer' target='_blank' aria-label='Link to Rafi&apos;s Instagram'><FaInstagramSquare /></a></Link>
                <Link href='https://www.linkedin.com/in/rafi2018/'><a rel='noopener noreferrer' target='_blank' aria-label='Link to Rafi&apos;s LinkedIn'><FaLinkedin /></a></Link>
            </div>
        </footer>
    );
};