'use client';

import { useEffect, useState } from 'react';

export default function Leaderboard() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getLeaderBoardScores() {
            try {
                const response = await fetch('/getLeaderboard');

                if (!response.ok) {
                    throw new Error(`Leaderboard request failed (${response.status})`);
                }

                const data = await response.json();
                // Store the leaderboard data in state here.
            } catch (error) {
                console.error('Unable to load leaderboard:', error);
                setError('Unable to load the leaderboard. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        getLeaderBoardScores();
    }, []);

    if (loading) return <p>Loading leaderboard...</p>;
    if (error) return <p role="alert">{error}</p>;

    return <div>{/* Render leaderboard here. */}</div>;
}
