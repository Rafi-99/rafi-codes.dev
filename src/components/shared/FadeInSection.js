'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '@styles/component/FadeInSection.module.css';

export default function FadeInSection({ delay = 0, children }) {
    const [ visible, setVisible ] = useState(false);
    const componentRef = useRef(null);

    useEffect(() => {
        let observerRefValue = null;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setVisible(true);
                observer.unobserve(componentRef.current);
            }
        });

        if (componentRef.current) {
            observer.observe(componentRef.current);
            observerRefValue = componentRef.current;
        }

        return () => {
            if (observerRefValue) {
                observer.unobserve(observerRefValue);
            }
        };
    }, []);

    return (
        <div ref={componentRef} className={visible ? styles.visible : styles.hidden} style={{ transitionDelay: `${delay}s` }}>
            {children}
        </div>
    );
}
