'use client';

import { type SubmitEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageCard from '../components/PageCard';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [pending, setPending] = useState(false);
    const router = useRouter();

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (pending) return;
        setError('');
        setPending(true);
        try {
            const response = await fetch('/api/auth/awsSignIn', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.message || 'Unable to log in. Please try again.');
                return;
            }
            router.push('/gameRules');
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setPending(false);
        }
    }

    return (
        <PageCard eyebrow="YOUR NEXT ROUND AWAITS" title="Welcome back" description="Sign in and get back in the game.">
            <form className="account-form" onSubmit={handleSubmit} aria-busy={pending}>
                <label className="account-field" htmlFor="username">
                    Username
                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="Your username"
                    />
                </label>
                <label className="account-field" htmlFor="password">
                    Password
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Your password"
                    />
                </label>
                {error && (
                    <p className="account-error" role="alert">
                        {error}
                    </p>
                )}
                <button className="account-button" type="submit" disabled={pending}>
                    {pending ? 'Please wait…' : 'Log in'}
                </button>
            </form>
            <p className="account-footer">
                New here? <Link href="/signUp">Create an account</Link>
            </p>
        </PageCard>
    );
}
