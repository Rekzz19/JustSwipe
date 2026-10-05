import Link from 'next/link';
import type { ReactNode } from 'react';

export default function PageCard({
    eyebrow,
    title,
    description,
    children,
}: {
    eyebrow: string;
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <main className="account-page">
            <div className="account-wrap">
                <Link href="/" className="account-brand">
                    JUST<span>SWIPE</span>
                </Link>
                <section className="account-card" aria-labelledby="page-title">
                    <p className="account-eyebrow">{eyebrow}</p>
                    <h1 id="page-title">{title}</h1>
                    <p className="account-description">{description}</p>
                    {children}
                </section>
                <p className="account-tagline">Test your hoop knowledge.</p>
            </div>
        </main>
    );
}
