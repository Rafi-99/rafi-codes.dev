import { useEffect, useRef, useState } from 'react';
import styles from '../styles/components/FadeInSection.module.css';

export default function FadeInSection(props) {
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
        <div ref={componentRef} className={visible ? styles.visible : styles.hidden}>
            {props.children}
        </div>
    );
};