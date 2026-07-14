'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    const handlePlayButton = () => {
        router.push('/game');
    };
    return (
        <div className="flex flex-col flex-1 items-center justify-center text-center bg-[#0C2340] font-sans">
            <main>
                <h1 className="font-bebas text-5xl tracking-wide">Just Swipe</h1>
                <p>Test your hoop knowledge</p>
                <div className="border rounded-md mt-5">
                    <button onClick={handlePlayButton}>PLAY</button>
                </div>
            </main>
        </div>
    );
}
