'use client';

import useTypingEffect from '@hooks/useTypingEffect';
import styles from '@styles/component/TypeWriter.module.css';

export default function TypeWriter() {
    const words = [
        'A software engineer. 💻',
        'A creative problem solver. 🎨',
        'A team player. 💪🏾',
    ];

    const [ currentWord ] = useTypingEffect(words);

    return (
        <p className={styles.text_type}>
            <span className={styles.text}>
                {currentWord}
                <span className="cursor" />
            </span>
        </p>
    );
}
