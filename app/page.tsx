'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
    const [played, setPlayed] = useState<boolean | null>(null);
    const router = useRouter();

    const handlePlayButton = () => {
        router.push('/game');
    };

    const handleSignUpButton = () => {
        router.push('/signUp');
    };

    useEffect(() => {
        async function checkUserState() {
            const res = await fetch('/api/checkUserState');
            const data = await res.json();
            setPlayed(data.played);
        }

        checkUserState();
    }, []);

    function userPlay() {
        if (played === null) {
            return <p>Loading...</p>;
        }

        if (played) {
            return <p>You have already played today.</p>;
        }

        return (
            <div className="border rounded-md mt-5">
                <button onClick={handlePlayButton}>PLAY</button>
            </div>
        );
    }

    //render conditionally i
    return (
        <div className="flex flex-col flex-1 items-center justify-center text-center bg-[#0C2340] font-sans">
            <main>
                <h1 className="font-bebas text-5xl tracking-wide">Just Swipe</h1>
                <p>Test your hoop knowledge</p>

                {userPlay()}

                <div className="border rounded-md mt-5">
                    <button onClick={handleSignUpButton}>Sign up</button>
                </div>
            </main>
        </div>
    );
}
