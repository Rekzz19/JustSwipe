'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PageCard from '../components/PageCard';
import { isLeaderboardEntry, LEADERBOARD_LIMIT, type LeaderboardEntry } from './types';

export default function Leaderboard() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        async function loadLeaderboard() {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/getLeaderboard', {
                    signal: controller.signal,
                    cache: 'no-store',
                });
                if (!response.ok) throw new Error(`Leaderboard request failed (${response.status})`);
                const data: unknown = await response.json();
                if (
                    typeof data !== 'object' ||
                    data === null ||
                    !('Items' in data) ||
                    !Array.isArray(data.Items) ||
                    !data.Items.every(isLeaderboardEntry)
                )
                    throw new Error('Invalid leaderboard response');
                if (!controller.signal.aborted) {
                    setEntries(data.Items.slice(0, LEADERBOARD_LIMIT));
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error('Unable to load leaderboard:', error);
                    setError('Unable to load the leaderboard. Please try again.');
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }
        void loadLeaderboard();
        return () => controller.abort();
    }, [attempt]);

    return (
        <PageCard eyebrow="TOP 7" title="Leaderboard" description="See who's setting the pace on the court.">
            <div className="leaderboard-content" aria-busy={loading}>
                {loading ? (
                    <p role="status" className="account-description">
                        Loading leaderboard…
                    </p>
                ) : error ? (
                    <div>
                        <p role="alert" className="account-error">
                            {error}
                        </p>
                        <button
                            className="account-button leaderboard-retry"
                            onClick={() => setAttempt((value) => value + 1)}
                        >
                            Try again
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="leaderboard-scroll">
                            <table className="leaderboard-table">
                                <caption className="sr-only">Top seven leaderboard scores</caption>
                                <thead>
                                    <tr>
                                        <th scope="col">No.</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Score</th>
                                        <th scope="col">Game IQ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.map((entry, index) => (
                                        <tr key={JSON.stringify([entry.userId, entry.recordId])}>
                                            <td className="leaderboard-rank">{index + 1}</td>
                                            <th scope="row">{entry.username}</th>
                                            <td className="leaderboard-score">{entry.score}</td>
                                            <td>
                                                <span aria-label="Game IQ coming soon">—</span>
                                            </td>
                                        </tr>
                                    ))}
                                    {entries.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="leaderboard-empty">
                                                No scores yet. Complete a round to get things started.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <p className="score-caption leaderboard-note">Game IQ is coming soon.</p>
                    </>
                )}
            </div>
            <p className="account-footer">
                <Link href="/">Back to home</Link>
            </p>
        </PageCard>
    );
}
