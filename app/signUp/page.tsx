'use client';

import { type SubmitEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageCard from '../components/PageCard';
import { cognitoSignUp } from '../aws/auth/cognitoAuth';

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
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
            const result = await cognitoSignUp({ username, email, password });
            if (!result) {
                setError('Unable to create your account. Check your details and try again.');
                return;
            }
            router.push(`/confirmSignUp?username=${encodeURIComponent(username)}`);
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setPending(false);
        }
    }

    return (
        <PageCard
            eyebrow="START YOUR STREAK"
            title="Join the game"
            description="Create your account and test your basketball knowledge."
        >
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
                        placeholder="Choose a username"
                    />
                </label>
                <label className="account-field" htmlFor="email">
                    Email
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                    />
                </label>
                <label className="account-field" htmlFor="password">
                    Password
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Create a password"
                    />
                </label>
                {error && (
                    <p className="account-error" role="alert">
                        {error}
                    </p>
                )}
                <button className="account-button" type="submit" disabled={pending}>
                    {pending ? 'Please wait…' : 'Create account'}
                </button>
            </form>
            <p className="account-footer">
                Already have an account? <Link href="/login">Log in</Link>
            </p>
        </PageCard>
    );
}
