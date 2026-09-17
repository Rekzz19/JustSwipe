'use client';

import { type SubmitEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { confirmSignUp } from '../aws/auth/confirmSignup';

export default function ConfirmSignUp() {
    const searchParams = useSearchParams();
    const username = searchParams.get('username');

    const router = useRouter();

    const [code, setCode] = useState('');

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!username) {
            return;
        }

        const res = await confirmSignUp({
            clientId: '7svqjqvhdohgddq5088ptfl71k',
            username,
            code,
        });

        if (res.$metadata.httpStatusCode == 200) {
            router.push(`/login`);
        }
    }

    if (!username) {
        return <p>Missing username. Please sign up again.</p>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <input className="border" value={code} onChange={(event) => setCode(event.target.value)} />

            <button>Confirm account</button>
        </form>
    );
}

//clientid should be an env variable
