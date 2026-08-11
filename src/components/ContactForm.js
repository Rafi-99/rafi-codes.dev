'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useRef, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import TerminalWindow from '@components/TerminalWindow';
import styles from '@styles/component/Form.module.css';

export default function ContactForm() {
    const alert = useRef(null);
    const [ inputs, setInputs ] = useState({});

    const displayAlert = (status) => {
        if (status === 'sending') {
            alert.current.classList.remove(styles.successMessage, styles.errorMessage);
            alert.current.textContent = 'Sending...';
        }

        else {
            if (status === 'success') {
                alert.current.classList.add(styles.successMessage);
                alert.current.textContent = 'Message sent. ✓';
            }

            else {
                alert.current.classList.add(styles.errorMessage);
                alert.current.textContent = 'Error. Try again. ✗';
            }

            setTimeout(() => {
                alert.current.classList.remove(styles.successMessage, styles.errorMessage);
                alert.current.textContent = '$ send --message';
            }, 3000);
        }
    };

    const handleChange = (event) => {
        const key = event.target.name;
        const value = event.target.value;
        setInputs((values) => ({ ...values, [key]: value }));
    };

    const handleSubmit = async (event) => {
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
        <TerminalWindow title='rafi@codes: ~/contact' className={styles.formContainer} variant='ambient'>
            <div className={styles.body}>
                <p className={styles.heading}><FaPaperPlane />&nbsp;Let&apos;s Connect!</p>

                <form action='/api/contact' method='POST' id='email-form' onSubmit={handleSubmit}>
                    <label htmlFor='name'><span className={styles.comment}>#</span> Name</label>
                    <input type='text' aria-label='Name' id='name' name='name' value={inputs.name || ''} onChange={handleChange} required autoComplete='off' />

                    <label htmlFor='email'><span className={styles.comment}>#</span> Email</label>
                    <input type='email' aria-label='Email' id='email' name='email' value={inputs.email || ''} onChange={handleChange} required autoComplete='off' />

                    <label htmlFor='message'><span className={styles.comment}>#</span> Message</label>
                    <textarea rows='5' form='email-form' aria-label='Message' id='message' name='message' value={inputs.message || ''} onChange={handleChange} required />

                    <button ref={alert} type='submit' aria-label='Send Message'>$ send --message</button>
                    <Script src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`} async defer />
                    <small>This site is protected by reCAPTCHA and the Google <Link href='https://policies.google.com/privacy' rel='noopener noreferrer' target='_blank'>Privacy Policy</Link> and <Link href='https://policies.google.com/terms' rel='noopener noreferrer' target='_blank'>Terms of Service</Link> apply.</small>
                </form>
            </div>
        </TerminalWindow>
    );
}
