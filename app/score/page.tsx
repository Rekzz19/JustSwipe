'use client'; //why do i do this?

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ScoreContent() {
    const param = useSearchParams();
    const score = param.get('score');

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#0C2340]">
            <div>
                <h1>You scored {score}</h1>
            </div>
        </div>
    );
}

export default function Score() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-[#0C2340]">
                    <h1>Loading score...</h1>
                </div>
            }
        >
            <ScoreContent />
        </Suspense>
    );
}

//test the page receives a score from parameter
//i need a better way of handling score
