'use client';

import { type SubmitEvent, useState } from 'react';
import { cognitoSignUp } from '../aws/auth/cognitoAuth';
import { useRouter } from 'next/navigation';

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const result = await cognitoSignUp({
            username,
            email,
            password,
        });

        console.log(result);
        if (result) {
            router.push(`/confirmSignUp?username=${encodeURIComponent(username)}`);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h1>Sign Up</h1>

                <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username" />

                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email"
                />

                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                />

                <button type="submit">Submit</button>
            </form>
        </>
    );
}
