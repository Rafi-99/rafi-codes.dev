import { buildPageMetadata } from '@utils/shared/OpenGraph';
import ContactForm from '@components/contact/ContactForm';
import styles from '@styles/page/contact.module.css';

export const metadata = buildPageMetadata({
    title: 'Contact',
    description: 'Use this page to get in touch with me!',
    path: '/contact',
    socialDescription:'Use this page to get in touch with me regarding new work opportunities or collaborations.',
    image: {
        title: 'Contact Rafi',
        description: 'Interested? Connect with me!',
        prompt: '$ send --message',
        tag: 'contact',
        accent: '#93c5fd'
    }
});

export default function Contact() {
    return (
        <div className={`page-flex ${styles.wrapper}`}>
            <ContactForm />
        </div>
    );
}
