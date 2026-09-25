'use client';
import { type SubmitEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const response = await fetch('/api/auth/awsSignIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        const data = await response.json();
        //console.log(data);

        if (!response.ok) {
            console.error(data.message);
            return;
        }

        router.push('/gameRules');
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>

            <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="username" />
            <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="paswword" />

            <button type="submit">Submit</button>
        </form>
    );
}
