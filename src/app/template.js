'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Template({ children }) {
    const router = useRouter();

    useEffect(() => {
        const handlePageShow = (event) => {
            if (event.persisted) {
                router.refresh();
            }
        };

        window.addEventListener('pageshow', handlePageShow);
        return () => window.removeEventListener('pageshow', handlePageShow);
    }, [ router ]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} style={{ display: 'flex', flexDirection: 'column', minHeight: 'inherit', flex: 1 }}>
            {children}
        </motion.div>
    );
}
