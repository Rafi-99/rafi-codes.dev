'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdClear, MdMenu } from 'react-icons/md';
import { usePreventScroll } from '@react-aria/overlays';
import Logo from '@components/Logo';
import styles from '@styles/component/Navigation.module.css';

const links = [
    { href: '/about', label: 'about' },
    { href: '/projects', label: 'projects' },
    { href: '/contact', label: 'contact' },
];

export default function Navigation() {
    const currentPath = usePathname();
    const [ previousPath, setPreviousPath ] = useState(currentPath);
    const [ opened, setOpened ] = useState(false);

    // Close the mobile menu on every route change. This is the "adjust
    // state during render" pattern React recommends instead of an effect
    // for exactly this case — comparing against a stored previous value
    // and calling setState in the render body (not inside useEffect)
    // avoids the cascading-render warning entirely, since React bails out
    // and re-renders with the corrected state before anything paints.
    if (currentPath !== previousPath) {
        setPreviousPath(currentPath);
        setOpened(false);
    }

    usePreventScroll({ isDisabled: !opened });

    return (
        <nav className={styles.nav}>
            <Link href='/' className={styles.brand}>
                <Logo size={26} />
                <span>rafi@codes</span>
                <span className={styles.promptSymbol}>:~$</span>
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
                                    <span className={styles.promptSymbol}>cd</span> ~/{label}
                                    {active && <span className='cursor' />}
                                </Link>
                            </li>
                        );
                    })
                }
            </ul>
        </nav>
    );
};
