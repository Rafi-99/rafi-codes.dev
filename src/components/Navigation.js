'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdClear, MdMenu } from 'react-icons/md';
import Logo from '@components/Logo';
import styles from '@styles/component/Navigation.module.css';

const links = [
    { href: '/about', label: 'about' },
    { href: '/projects', label: 'projects' },
    { href: '/contact', label: 'contact' },
];

export default function Navigation() {
    const [ open, setOpen ] = useState(false);
    const pathname = usePathname();
    const [ prevPathname, setPrevPathname ] = useState(pathname);

    // Close the mobile menu on every route change. This is the "adjust
    // state during render" pattern React recommends instead of an effect
    // for exactly this case — comparing against a stored previous value
    // and calling setState in the render body (not inside useEffect)
    // avoids the cascading-render warning entirely, since React bails out
    // and re-renders with the corrected state before anything paints.
    if (pathname !== prevPathname) {
        setPrevPathname(pathname);
        setOpen(false);
    }

    // This one's a legitimate effect: syncing React state with an actual
    // external system (the DOM's body scroll), not calling setState — so
    // it's untouched by this lint rule.
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [ open ]);

    return (
        <nav className={styles.nav}>
            <Link href='/' className={styles.brand}>
                <Logo size={26} />
                <span>rafi@codes</span>
                <span className={styles.promptSymbol}>:~$</span>
            </Link>

            <button type='button' className={styles.burger} onClick={() => setOpen(!open)} aria-label='Toggle navigation menu' aria-expanded={open}>
                {open ? <MdClear fontSize='1.5rem' /> : <MdMenu fontSize='1.5rem' />}
            </button>

            <ul className={open ? styles.open : styles.closed}>
                {links.map(({ href, label }) => {
                        const active = pathname === href;
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
