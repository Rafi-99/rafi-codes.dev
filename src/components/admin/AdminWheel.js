'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { MdChecklist, MdSettings, MdLogout, MdArrowBack, MdHome, MdLock } from 'react-icons/md';
import Logo from '@components/layout/Logo';
import styles from '@styles/component/AdminWheel.module.css';

const HOME = '/admin/dashboard';
const TREE = {
    href: HOME,
    label: 'Dashboard',
    icon: MdHome,
    children: [
        { href: '/admin/dashboard/tickets', label: 'Task Board', icon: MdChecklist, children: [] },
        { href: '/admin/dashboard/settings', label: 'Settings', icon: MdSettings, children: [ { href: '/admin/dashboard/settings/change-password', label: 'Change Password', icon: MdLock, children: [] } ] }
    ]
};

function buildIndex(node, parent, index) {
    const indexed = { ...node, parent };
    index[node.href] = indexed;
    node.children.forEach((child) => buildIndex(child, indexed, index));
    return index;
}

const NODE_INDEX = buildIndex(TREE, null, {});

const CLOSE_TRANSITION_MS = 450; // Must match .item's translate transition duration in the CSS

export default function AdminWheel({ logoutAction }) {
    const [ mounted, setMounted ] = useState(false);
    const [ open, setOpen ] = useState(false);
    const [ cursor, setCursor ] = useState(null);
    const wheelRef = useRef(null);
    const checkboxRef = useRef(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setOpen(false);
        setCursor(null);

        if (checkboxRef.current) {
            checkboxRef.current.checked = false;
        }
    }, [ pathname ]);

    useLayoutEffect(() => {
        if (!mounted) {
            return;
        }

        const footer = document.querySelector('footer');

        if (!footer || !wheelRef.current) {
            return;
        }

        const applyOffset = () => {
            wheelRef.current.style.setProperty('--footer-half-height', `${footer.offsetHeight / 2}px`);
        };

        applyOffset();

        const observer = new ResizeObserver(applyOffset);
        observer.observe(footer);

        return () => observer.disconnect();
    }, [ mounted ]);

    const handleToggle = (element) => {
        const isOpen = element.target.checked;
        setOpen(isOpen);

        if (!isOpen) {
            setCursor(null);
        }
    };

    const closeThenNavigate = (event, href) => {
        if (event) {
            event.preventDefault();
        }

        setOpen(false);
        setCursor(null);

        if (checkboxRef.current) {
            checkboxRef.current.checked = false;
        }

        setTimeout(() => router.push(href), CLOSE_TRANSITION_MS);
    };

    const closeThenLogout = () => {
        setOpen(false);
        setCursor(null);

        if (checkboxRef.current) {
            checkboxRef.current.checked = false;
        }

        setTimeout(() => logoutAction(), CLOSE_TRANSITION_MS);
    };

    if (!mounted) {
        return null;
    }

    const normalizedPathname = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
    const currentNode = NODE_INDEX[normalizedPathname] ?? NODE_INDEX[HOME];
    const activeNode = cursor ?? currentNode;
    const moved = cursor !== null;

    // Pure wheel-state move — never navigates. Same mechanism whether going deeper into a category or back up toward the root.
    const handleBack = () => {
        if (activeNode.parent) {
            setCursor(activeNode.parent);
        }
    };

    const showBack = !!activeNode.parent;
    const showHome = activeNode.href !== HOME;

    const displayItems = [
        ...(moved ? [ { ...activeNode, isSelf: true } ] : []),
        ...activeNode.children,
        ...(showBack ? [ { href: '#back', label: 'Back', icon: MdArrowBack, isBack: true } ] : []),
        ...(showHome ? [ { href: HOME, label: 'Home', icon: MdHome, isHome: true } ] : []),
        { href: '#logout', label: 'Log out', icon: MdLogout, isLogout: true }
    ];

    const angleStep = 360 / displayItems.length;
    const angleOffset = -90;

    return createPortal(
        <div ref={wheelRef} className={styles.wheel}>
            <input ref={checkboxRef} type='checkbox' id='admin-wheel-toggle' className={styles.state} onChange={handleToggle} />
            <label htmlFor='admin-wheel-toggle' className={styles.backdrop} aria-hidden='true' />
            <ul className={styles.orbit}>
                <AnimatePresence>
                    {open && displayItems.map((item, index) => {
                        const angle = `${angleOffset + angleStep * index}deg`;

                        const handleClick = (e) => {
                            if (item.isBack) {
                                e.preventDefault();
                                handleBack();
                            }
                            else if (item.isLogout) {
                                e.preventDefault();
                                closeThenLogout();
                            }
                            else if (item.isSelf || item.isHome) {
                                closeThenNavigate(e, item.href);
                            }
                            else if (item.children.length > 0) {
                                e.preventDefault();
                                setCursor(NODE_INDEX[item.href]);
                            }
                            else {
                                closeThenNavigate(e, item.href);
                            }
                        };

                        return (
                            <motion.li key={`${activeNode.href}-${item.href}-${item.label}`} className={styles.item} style={{ '--angle': angle }} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.22 }}>
                                <Link href={item.href} onClick={handleClick} aria-label={item.label} title={item.label} className={item.isSelf ? styles.itemSelf : ''}><item.icon /></Link>
                            </motion.li>
                        );
                    })}
                </AnimatePresence>
            </ul>

            <label htmlFor='admin-wheel-toggle' className={styles.hub}>
                <Logo size={26} className={styles.hubLogo} showBackground={false} />
                <span className={styles.hubClose} aria-hidden='true'>×</span>
                <span className={styles.sr}>Toggle admin menu</span>
            </label>
        </div>,
        document.body
    );
}
