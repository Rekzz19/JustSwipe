'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PageCard from './components/PageCard';

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
            <button className="account-button" type="button" onClick={handlePlayButton}>
                Play
            </button>
        );
    }

    return (
        <div className="home-page">
            <PageCard
                eyebrow="YOUR DAILY BASKETBALL CHALLENGE"
                title="Just Swipe"
                description="Test your hoop knowledge."
            >
                <div className="home-actions">
                    {userPlay()}
                    <Link className="account-button home-secondary" href="/leaderboard">
                        View leaderboard
                    </Link>
                    <button className="account-button home-secondary" type="button" onClick={handleSignUpButton}>
                        Sign up
                    </button>
                </div>
            </PageCard>
        </div>
    );
}
