import { getLeaderboardData } from '@/app/aws/leaderboard/getDynamodbLeaderboard';

export async function GET() {
    try {
        const items = await getLeaderboardData();
        return Response.json({ Items: items }, { headers: { 'Cache-Control': 'no-store' } });
    } catch (error) {
        console.error('Unable to load leaderboard:', error);
        return Response.json({ error: 'Unable to load the leaderboard. Please try again.' }, { status: 503 });
    }
}
