'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@styles/component/AdminForm.module.css';

export default function AdminForm({ fields, endpoint, hiddenFields = {}, submitLabel, loadingLabel, successMessage, redirectTo, redirectDelayMs = 0, initialError = '' }) {
    const router = useRouter();
    const [ values, setValues ] = useState(() => Object.fromEntries(fields.map((field) => [ field.name, '' ])));
    const [ error, setError ] = useState(initialError);
    const [ done, setDone ] = useState(false);
    const [ secondsLeft, setSecondsLeft ] = useState(Math.ceil(redirectDelayMs / 1000));
    const [ loading, setLoading ] = useState(false);

    // After the reset password countdown completes, send user to the admin login page.
    useEffect(() => {
        if (!done || !redirectTo || !redirectDelayMs) {
            return;
        }

        if (secondsLeft <= 0) {
            router.push(redirectTo);
            return;
        }

        const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [ done, secondsLeft, redirectTo, redirectDelayMs, router ]);

    // Error message
    useEffect(() => {
        if (initialError) {
            window.history.replaceState(null, '', window.location.pathname);
        }
    }, [ initialError ]);

    const handleChange = (name) => (event) => setValues((prev) => ({ ...prev, [name]: event.target.value }));

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        let response;

        try {
            response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, ...hiddenFields }) });
        }
        catch {
            setLoading(false);
            setError('Could not reach the server. Check your connection and try again.');
            return;
        }

        setLoading(false);

        if (response.ok) {
            if (redirectTo && !redirectDelayMs) {
                router.push(redirectTo);
                router.refresh();
                return;
            }
            setDone(true);
            setValues(Object.fromEntries(fields.map((field) => [ field.name, '' ])));
        }
        else {
            const data = await response.json().catch(() => ({}));
            setError(data.error || 'Something went wrong.');
        }
    };

    if (done) {
        return (
            <div className={styles.form}>
                <p className={styles.success}>{successMessage}</p>
                {redirectTo && redirectDelayMs > 0 && (
                    <p className={styles.redirectNote}>Redirecting in {secondsLeft}...</p>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {fields.map((field) => (<input key={field.name} type={field.type} value={values[field.name]} onChange={handleChange(field.name)} placeholder={field.placeholder} className='form-input' autoComplete={field.autoComplete} required/>))}
            {error && <p className={styles.error}>{error}</p>}
            <button type='submit' className='pushable accent'>{loading ? loadingLabel : submitLabel}</button>
        </form>
    );
}
