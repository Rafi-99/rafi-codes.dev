import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MdPerson, MdCode, MdInbox, MdHome, MdClear, MdMenu } from 'react-icons/md';
import styles from '../styles/components/Navigation.module.css';

export default function Navigation() {
    const [ clicked, setClicked ] = useState(false);
    const handleMobileMenuToggle = () => setClicked(!clicked);

    useEffect(() => {
        if (clicked) {
            document.body.classList.add('overlay');
        }

        return () => {
            document.body.classList.remove('overlay');
        };
    }, [ clicked ]);

    return (
        <nav className={styles.nav}>
            <Link href='/'><a className={styles.brand}><Image src='/assets/favicons/Terminal.png' width={40} height={40} alt='Website Logo' priority />&nbsp;Rafi Codes</a></Link>

            <div className={styles.burger} onClick={handleMobileMenuToggle}>
                {clicked ? <MdClear fontSize='2rem' /> : <MdMenu fontSize='2rem' />}
            </div>

            <ul className={clicked ? styles.open : styles.closed}>
                <li><Link href='/about'><a onClick={handleMobileMenuToggle}><MdPerson />&nbsp;About Me</a></Link></li>
                <li><Link href='/projects'><a onClick={handleMobileMenuToggle}><MdCode />&nbsp;My Projects</a></Link></li>
                <li><Link href='/contact'><a onClick={handleMobileMenuToggle}><MdInbox />&nbsp;Contact Me</a></Link></li>
            </ul>

            <Link href='/'><a className={styles.home}><MdHome fontSize='1rem' />&nbsp;Home</a></Link>
        </nav>
    );
};