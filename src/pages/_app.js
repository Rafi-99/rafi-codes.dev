import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import { Analytics } from '@vercel/analytics/react';
import '../styles/global/globals.css';

export default function App({ Component, pageProps }) {
    const [ loading, setLoading ] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const handleLoadStart = () => {
            setLoading(true);
        };

        const handleLoadEnd = () => {
            setLoading(false);
        };

        router.events.on('routeChangeStart', handleLoadStart);
        router.events.on('routeChangeComplete', handleLoadEnd);
        router.events.on('routeChangeError', handleLoadEnd);

        return () => {
            router.events.off('routeChangeStart', handleLoadStart);
            router.events.off('routeChangeComplete', handleLoadEnd);
            router.events.off('routeChangeError', handleLoadEnd);
        };
    }, [ router ]);

    return (
        <>
            <AnimatePresence exitBeforeEnter>
                {loading ?
                    <Loader />
                : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, minHeight: 'inherit', display: 'flex', flexDirection: 'column' }} transition={{ duration: 1 }} exit={{ opacity: 0 }}>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </motion.div>

                )}
            </AnimatePresence>
            <Analytics />
        </>
    );
};

export function reportWebVitals(metric) {
    console.log(metric);
};