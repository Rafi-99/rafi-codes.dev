'use client';

import useDateTime from '@hooks/useLiveDateTime';
import styles from '@styles/component/DateTime.module.css';

export default function DateTime() {
    const [ currentDate, currentTime ] = useDateTime();

    return (
        <p className={styles.datetime} suppressHydrationWarning>{currentDate} · {currentTime}</p>
    );
};
