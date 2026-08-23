import Link from 'next/link';
import { generateOpenGraphImage } from '@utils/OpenGraph';
import TerminalWindow from '@components/TerminalWindow';
import styles from '@styles/page/legal.module.css';

export const metadata = {
    title: 'Privacy Policy',
    description: 'This page contains the privacy policy for the site.',
    alternates: { canonical: '/privacy-policy' },
    openGraph: {
        title: 'Rafi Codes | Privacy Policy',
        description: 'How Rafi Codes handles information submitted through the contact form.',
        url: `${process.env.SITE_URL}/privacy-policy`,
        images: [{ url: generateOpenGraphImage({ title: 'Privacy Policy', description: 'How your information is handled.', prompt: '$ cat privacy-policy.md', tag: 'Legal', accent: '#34d399' }), width: 1200, height: 630, alt: 'Rafi Codes - Privacy Policy | Open Graph Card' }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Rafi Codes | Privacy Policy',
        description: 'How Rafi Codes handles information submitted through the contact form.',
        images: [ generateOpenGraphImage({ title: 'Privacy Policy', description: 'How your information is handled.', prompt: '$ cat privacy-policy.md', tag: 'Legal', accent: '#34d399' }) ]
    }
};

export default function Privacy() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.intro}>
                <h1 className={styles.promptLine}><span className={styles.promptSymbol}>$</span> cat privacy-policy.md</h1>
            </div>

            <TerminalWindow title='rafi@codes: ~/privacy-policy' className={styles.terminal}>
                <div className={styles.prose}>
                    <p className={styles.effectiveDate}>Effective Date: August 22, 2026</p>

                    <p>We respect your privacy. This website <code>rafi-codes.dev</code> provides a standard contact form to allow visitors to get in touch.</p>

                    <h2>Information We Collect</h2>
                    <p>When you submit our contact form, we collect the personal information you choose to provide, which may include your name, email address, and message content.</p>

                    <h2>How We Use Your Information</h2>
                    <p>We use this information solely to read, respond to, and process your specific inquiry. We do not sell, rent, or share your personal data with third parties.</p>

                    <h2>Data Processing via Google</h2>
                    <p>Our contact form backend utilizes automated scripts to forward your message to our personal email inbox. No long-term database storage of your personal data is maintained on this site.</p>

                    <h2>Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at: <Link href='mailto:contact@rafi-codes.dev'>contact@rafi-codes.dev</Link></p>
                </div>
            </TerminalWindow>
        </div>
    );
}
