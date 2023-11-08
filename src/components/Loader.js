'use client';

import { motion } from 'framer-motion';
import styles from '../styles/components/Loader.module.css';

export default function Loader() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, minHeight: 'inherit', display: 'flex', flexDirection: 'column' }} transition={{ duration: 1 }} exit={{ opacity: 0 }}>
            <div className={styles.outer_loader}>
                <div className={styles.inner_loader} />
            </div>
        </motion.div>
    );
};