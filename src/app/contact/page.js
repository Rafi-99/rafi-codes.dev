import { generateOpenGraphImage } from '@utils/OpenGraph';
import ContactForm from '@components/ContactForm';
import styles from '@styles/page/contact.module.css';

export const metadata = {
    title: 'Contact',
    description: 'Use this page to get in touch with me!',
    alternates: { canonical: '/contact' },
    openGraph: {
        title: 'Rafi Codes | Contact',
        description: 'Use this page to get in touch with me regarding new work opportunities or collaborations.',
        url: 'https://www.rafi-codes.dev/contact',
        images: [{ url: generateOpenGraphImage({ title: 'Contact Rafi', description: 'Interested? Connect with me!', prompt: '$ send --message', tag: 'contact', accent: '#93c5fd' }), width: 1200, height: 630, alt: 'Rafi Codes - Contact | Open Graph Card' }]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Rafi Codes | Contact',
        description: 'Use this page to get in touch with me regarding new work opportunities or collaborations.',
        images: [ generateOpenGraphImage({ title: 'Contact Rafi', description: 'Interested? Connect with me!', prompt: '$ send --message', tag: 'contact', accent: '#93c5fd' }), ]
    }
};

export default function Contact() {
    return (
        <div className={styles.wrapper}>
            <ContactForm />
        </div>
    );
};
