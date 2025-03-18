import Image from 'next/legacy/image';
import Link from 'next/link';
import { useState } from 'react';
import { usePreventScroll } from '@react-aria/overlays';
import { MdPerson, MdCode, MdInbox, MdHome, MdClear, MdMenu } from 'react-icons/md';
import styles from '../styles/components/Navigation.module.css';

export default function Navigation() {
    const [ clicked, setClicked ] = useState(false);
    const handleMobileMenuToggle = () => setClicked(!clicked);

    usePreventScroll(clicked);

    return (
        <nav className={styles.nav}>
            <Link href='/' className={styles.brand}><Image src='/assets/favicons/Terminal.png' width={40} height={40} alt='Website Logo' priority />&nbsp;Rafi Codes</Link>

            <div className={styles.burger} onClick={handleMobileMenuToggle}>
                {clicked ? <MdClear fontSize='2rem' /> : <MdMenu fontSize='2rem' />}
            </div>

            <ul className={clicked ? styles.open : styles.closed}>
                <li><Link href='/about' onClick={handleMobileMenuToggle}><MdPerson />&nbsp;About Me</Link></li>
                <li><Link href='/projects' onClick={handleMobileMenuToggle}><MdCode />&nbsp;My Projects</Link></li>
                <li><Link href='/contact' onClick={handleMobileMenuToggle}><MdInbox />&nbsp;Contact Me</Link></li>
            </ul>

            <Link href='/' className={styles.home}><MdHome fontSize='1rem' />&nbsp;Home</Link>
        </nav>
    );
};