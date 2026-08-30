'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { MdClear, MdMenu } from 'react-icons/md';
import { usePreventScroll } from '@react-aria/overlays';
import Logo from '@components/layout/Logo';
import styles from '@styles/component/Navigation.module.css';

const links = [
    { href: '/about', label: 'about' },
    { href: '/projects', label: 'projects' },
    { href: '/contact', label: 'contact' }
];

export default function Navigation() {
    const currentPath = usePathname();
    const router = useRouter();
    const [ previousPath, setPreviousPath ] = useState(currentPath);
    const [ opened, setOpened ] = useState(false);

    const handleBrandClick = () => {
        setOpened(false);

        if (currentPath === '/') {
            window.dispatchEvent(new Event('home:reset'));
            router.refresh();
        }
    };

    if (currentPath !== previousPath) {
        setPreviousPath(currentPath);
        setOpened(false);
    }

    usePreventScroll({ isDisabled: !opened });

    return (
        <nav className={styles.nav}>
            <Link href='/' className={styles.brand} onClick={handleBrandClick}>
                <Logo size={26} />
                <span>rafi@codes</span>
                <span className='prompt-symbol'>:~$</span>
                {currentPath === '/' && <span className='cursor' />}
            </Link>

            <button type='button' className={styles.burger} onClick={() => setOpened(!opened)} aria-label='Toggle navigation menu' aria-expanded={opened}>
                {opened ? <MdClear fontSize='1.5rem' /> : <MdMenu fontSize='1.5rem' />}
            </button>

            <ul className={opened ? styles.open : styles.closed}>
                {links.map(({ href, label }) => {
                    const active = currentPath === href;
                    return (
                        <li key={href}>
                            <Link href={href} className={active ? styles.active : ''}>
                                <span className='prompt-symbol'>cd</span> ~/{label}
                                {active && <span className='cursor' />}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
