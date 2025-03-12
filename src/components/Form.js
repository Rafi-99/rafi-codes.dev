import Link from 'next/link';
import Script from 'next/script';
import { useRef, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import styles from '../styles/components/Form.module.css';

export default function ContactForm() {
    const alert = useRef(null);
    const [ inputs, setInputs ] = useState({});

    const displayAlert = (status) => {
        if (status === 'sending') {
            alert.current.classList.remove(styles.success_message, styles.error_message);
            alert.current.textContent = '⏳ Sending...';
        }
        else if (status === 'success') {
            alert.current.classList.add(styles.success_message);
            alert.current.textContent = '🎉 Hooray! Your message has been sent!';
        }
        else {
            alert.current.classList.add(styles.error_message);
            alert.current.textContent = '😭 Sorry! There was an error. Please try again.';
        }

        if (status !== 'sending') {
            setTimeout(() => {
                alert.current.classList.remove(styles.success_message, styles.error_message);
                alert.current.textContent = '✅ Send Message';
            }, 3000);
        }
    };

    const handleChange = event => {
        const key = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [key]: value}));
    };

    const handleSubmit = async event => {
        event.preventDefault();
        displayAlert('sending');

        const recaptchaToken = await grecaptcha.enterprise.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'submit' });
        grecaptcha.enterprise.reset(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);

        const serverResponse = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.assign(inputs, { token: recaptchaToken }))
        });

        if (serverResponse.ok) {
            setInputs({});
            displayAlert('success');
        }
        else {
            displayAlert('failure');
        }
    };

    return (
        <>
            <div className={styles.form_container}>
                <h1 className={styles.title}><FaPaperPlane />&nbsp;Let&apos;s Get In Touch!</h1>

                <form action='/api/contact' method='POST' id='email-form' onSubmit={handleSubmit}>
                    <label htmlFor='name'>Name</label>
                    <input type='text' aria-label='Name' id='name' name='name' value={inputs.name || ''} onChange={handleChange} required autoComplete='off' />

                    <label htmlFor='email'>Email</label>
                    <input type='Email' aria-label='Email' id='email' name='email' value={inputs.email || ''} onChange={handleChange} required autoComplete='off' />

                    <label htmlFor='message'>Message</label>
                    <textarea rows='5' form='email-form' aria-label='Message' id='message' name='message' value={inputs.message || ''} onChange={handleChange} required />

                    <button ref={alert} type='submit' aria-label='Send Message'>✅ Send Message</button>
                    <Script src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`} async defer />
                    <small>This site is protected by reCAPTCHA and the Google <Link href="https://policies.google.com/privacy" rel='noopener noreferrer' target='_blank' aria-label='Google Privacy Policy'>Privacy Policy</Link> and <Link href="https://policies.google.com/terms" rel='noopener noreferrer' target='_blank' aria-label='Google Terms of Service'>Terms of Service</Link> apply.</small>
                </form>
            </div>
        </>
    );
};