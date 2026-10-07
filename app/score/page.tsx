'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PageCard from '../components/PageCard';

function ScoreContent() {
    const score = useSearchParams().get('score');
    const hasScore = score !== null && score.trim() !== '' && Number.isFinite(Number(score)) && Number(score) >= 0;

    return (
        <PageCard
            eyebrow="ROUND COMPLETE"
            title={hasScore ? 'Nice work!' : 'No score yet'}
            description={
                hasScore
                    ? 'Every round puts your hoop knowledge to the test.'
                    : 'Complete a round to see your score here.'
            }
        >
            {hasScore && (
                <div className="score-result">
                    <p className="account-eyebrow">YOUR SCORE</p>
                    <p className="score-number">{Number(score)}</p>
                    <p className="score-caption">Keep your basketball knowledge sharp.</p>
                </div>
            )}
            <div className="score-actions">
                <Link className="account-button" href="/leaderboard">
                    View leaderboard
                </Link>
                <Link className="account-button home-secondary" href="/">
                    Back to home
                </Link>
            </div>
            <p className="account-footer">
                <Link href="/gameRules">View game rules</Link>
            </p>
        </PageCard>
    );
}

export default function Score() {
    return (
        <Suspense
            fallback={
                <PageCard eyebrow="ROUND COMPLETE" title="Your results" description="Loading your score…">
                    <p role="status">Please wait…</p>
                </PageCard>
            }
        >
            <ScoreContent />
        </Suspense>
    );
}
