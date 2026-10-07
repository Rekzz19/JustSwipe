import { dynamoClient } from '@/config/dynamodbClient';
import { QueryCommand, type QueryCommandInput } from '@aws-sdk/lib-dynamodb';
import { isLeaderboardEntry, LEADERBOARD_LIMIT, type LeaderboardEntry } from '@/app/leaderboard/types';

export async function getLeaderboardData(): Promise<LeaderboardEntry[]> {
    const entries: LeaderboardEntry[] = [];
    let cursor: QueryCommandInput['ExclusiveStartKey'];

    // The index must use the numeric score as its sort key to rank all records.
    do {
        const response = await dynamoClient.send(
            new QueryCommand({
                TableName: 'jusswipe-score-dynamodb',
                IndexName: 'overall-score',
                KeyConditionExpression: 'leaderboard = :leaderboard',
                ExpressionAttributeValues: { ':leaderboard': 'OVERALL' },
                ScanIndexForward: false,
                Limit: LEADERBOARD_LIMIT - entries.length,
                ExclusiveStartKey: cursor,
            })
        );

        for (const item of response.Items ?? []) {
            if (!isLeaderboardEntry(item)) {
                throw new Error('Invalid leaderboard record');
            }
            // Return only the fields needed by the table.
            entries.push({ userId: item.userId, recordId: item.recordId, username: item.username, score: item.score });
        }
        cursor = response.LastEvaluatedKey;
    } while (cursor && entries.length < LEADERBOARD_LIMIT);

    return entries;
}
