import { useRef, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import styles from '../styles/components/Form.module.css';

export default function ContactForm() {
    const alert = useRef(null);
    const [ inputs, setInputs ] = useState({});

    const displayAlert = (status) => {
        status === 'success' ? alert.current.classList.add(styles.success_message) : alert.current.classList.add(styles.error_message);
        status === 'success' ? alert.current.textContent = '🎉 Hooray! Your message has been sent!' : alert.current.textContent = '😭 Sorry! There was an error. Please try again.';
        setTimeout(() => {
            alert.current.classList.contains(styles.success_message) ? alert.current.classList.remove(styles.success_message) : alert.current.classList.remove(styles.error_message);
            alert.current.textContent = '✅ Send Message';
        }, 3000);
    };

    const handleChange = event => {
        const key = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [key]: value}));
    };

    const handleSubmit = async event => {
        event.preventDefault();

        const serverReponse = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputs)
        });

        setInputs({});
        serverReponse.status === 200 ? displayAlert('success') : displayAlert('failure');
    };

    return (
        <>
            <div className={styles.form_container}>
                <h1 className={styles.title}><FaPaperPlane />&nbsp;Let&apos;s Get In Touch!</h1>

                <form action='/api/contact' method='POST' id='email-form' onSubmit={handleSubmit}>
                    <label htmlFor='Name'>Name</label>
                    <input type='text' aria-label='Name' id='name' name='name' value={inputs.name || ''} onChange={handleChange} required />

                    <label htmlFor='Email'>Email</label>
                    <input type='Email' aria-label='Email' id='email' name='email' value={inputs.email || ''} onChange={handleChange} required />

                    <label htmlFor='Message'>Message</label>
                    <textarea rows='5' form='email-form' aria-label='Message' id='message' name='message' value={inputs.message || ''} onChange={handleChange} required />

                    <button ref={alert} type='submit' aria-label='Send Message'>✅ Send Message</button>
                </form>
            </div>
        </>
    );
};