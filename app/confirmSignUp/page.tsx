'use client';

import { type SubmitEvent, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { confirmSignUp } from '../aws/auth/confirmSignup';
import PageCard from '../components/PageCard';

function ConfirmationForm() {
    const username = useSearchParams().get('username');
    const router = useRouter();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [pending, setPending] = useState(false);

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!username || pending) return;
        setError('');
        setPending(true);
        try {
            const res = await confirmSignUp({ clientId: '7svqjqvhdohgddq5088ptfl71k', username, code });
            if (res.$metadata.httpStatusCode === 200) {
                router.push('/login');
            } else {
                setError('Unable to confirm your account. Please try again.');
            }
        } catch {
            setError('Unable to verify that code. Check it and try again.');
        } finally {
            setPending(false);
        }
    }

    return (
        <PageCard
            eyebrow="ONE LAST STEP"
            title="Check your inbox"
            description="Enter the confirmation code sent to your email to activate your account."
        >
            {username ? (
                <form className="account-form" onSubmit={handleSubmit} aria-busy={pending}>
                    <label className="account-field" htmlFor="code">
                        Confirmation code
                        <input
                            id="code"
                            name="code"
                            className="account-code"
                            autoComplete="one-time-code"
                            required
                            value={code}
                            onChange={(event) => setCode(event.target.value)}
                            placeholder="Enter your code"
                        />
                    </label>
                    {error && (
                        <p className="account-error" role="alert">
                            {error}
                        </p>
                    )}
                    <button className="account-button" type="submit" disabled={pending}>
                        {pending ? 'Confirming…' : 'Confirm account'}
                    </button>
                </form>
            ) : (
                <p className="account-error" role="alert">
                    Missing username. <Link href="/signUp">Please sign up again.</Link>
                </p>
            )}
            <p className="account-footer">
                Already confirmed? <Link href="/login">Log in</Link>
            </p>
        </PageCard>
    );
}

export default function ConfirmSignUpPage() {
    return (
        <Suspense
            fallback={
                <PageCard eyebrow="ONE LAST STEP" title="Check your inbox" description="Loading confirmation form…">
                    <p role="status">Please wait…</p>
                </PageCard>
            }
        >
            <ConfirmationForm />
        </Suspense>
    );
}
