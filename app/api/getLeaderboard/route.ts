import { getLeaderboardData } from '@/app/aws/leaderboard/getDynamodbLeaderboard';

export async function GET() {
    await getLeaderboardData();

    //checks
}
