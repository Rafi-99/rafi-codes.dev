import useTypingEffect from '../hooks/useTypingEffect';
import styles from '../styles/components/TypeWriter.module.css';

export default function TypeWriter() {
    const words = ['software engineer.', 'creative problem solver.', 'team player.'];
    const [ currentWord ] = useTypingEffect(words);

    return (
        <p className={styles.text_type}>I am a{' '}<span className={styles.text}><strong>{currentWord}</strong></span></p>
    );
};