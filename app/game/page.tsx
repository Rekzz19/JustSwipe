import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import GameClient from './GameClient';

export default async function Game() {
    const cookieStore = await cookies();
    const datePlayed = cookieStore.get('datePlayed')?.value;
    const today = new Date().toISOString().split('T')[0];

    if (datePlayed === today) {
        redirect('/');
    }

    return <GameClient />;
}
