'use client';

import { motion } from 'framer-motion';
import styles from '@styles/component/Loader.module.css';

export default function Loader({ text = 'Connecting to rafi-codes.dev' }) {
    return (
        <motion.div className={styles.wrapper} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <p className={styles.line}><span className='prompt-symbol'>$</span> {text}</p>
            <div className={styles.bar}><div className={styles.fill} /></div>
        </motion.div>
    );
}
