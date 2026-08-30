import Link from 'next/link';
import { buildPageMetadata } from '@utils/shared/OpenGraph';
import TerminalWindow from '@components/shared/TerminalWindow';
import styles from '@styles/page/legal.module.css';

export const metadata = buildPageMetadata({
    title: 'Terms of Service',
    description: 'This page contains the terms of service for the site.',
    path: '/terms-of-service',
    socialDescription: 'The terms that apply when using the contact form on Rafi Codes.',
    image: {
        title: 'Terms of Service',
        description: 'Terms for using this site.',
        prompt: '$ cat terms-of-service.md',
        tag: 'Legal',
        accent: '#34d399'
    }
});

export default function Terms() {
    return (
        <div className='page-wrapper'>
            <div className={styles.intro}>
                <h1 className='prompt-line'><span className='prompt-symbol'>$</span> cat terms-of-service.md</h1>
            </div>

            <TerminalWindow title='rafi@codes: ~/terms' className={styles.terminal}>
                <div className={styles.prose}>
                    <p className={styles.effectiveDate}>Effective Date: August 22, 2026</p>

                    <p>Welcome to <code>rafi-codes.dev</code>. By accessing or using our contact form, you agree to comply with and be bound by these basic Terms of Service.</p>

                    <h2>Use of the Contact Form</h2>
                    <p>You agree to use our contact form only for lawful, legitimate inquiries. You are prohibited from using the form to send spam, malicious scripts, unsolicited marketing materials, or offensive content.</p>

                    <h2>Disclaimer of Warranties</h2>
                    <p>This website and its contact functionalities are provided on an &quot;as-is&quot; and &quot;as-available&quot; basis. We do not guarantee that the form will be completely error-free or uninterrupted.</p>

                    <h2>Changes to Terms</h2>
                    <p>We reserve the right to modify these terms at any time without prior notice. Continued use of the site implies acceptance of any changes.</p>

                    <h2>Contact Us</h2>
                    <p>For any questions regarding these terms, please contact us at: <Link href='mailto:contact@rafi-codes.dev'>contact@rafi-codes.dev</Link></p>
                </div>
            </TerminalWindow>
        </div>
    );
}
