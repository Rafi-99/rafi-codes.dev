import ContactForm from '@components/ContactForm';
import styles from '@styles/page/contact.module.css';

export const metadata = {
    title: 'Contact',
    description: 'Use this page to get in touch with me!',
    alternates: { canonical: '/contact' },
    openGraph: {
        title: 'Rafi Codes | Contact',
        description: 'Use this page to get in touch with me!',
        url: 'https://www.rafi-codes.dev/contact',
        images: [ '/assets/images/profile.png' ],
    },
};

export default function Contact() {
    return (
        <div className={styles.wrapper}>
            <ContactForm />
        </div>
    );
};
