import { dynamoClient } from '@/config/dynamodbClient';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';

export async function getLeaderboardData() {
    const params = {
        TableName: 'jusswipe-score-dynamodb',
        IndexName: 'overall-score',
        KeyConditionExpression: 'leaderboard = :leaderboard',
        ExpressionAttributeValues: {
            ':leaderboard': 'OVERALL',
        },

        ScanIndexForward: false,
        Limit: 10,
    };

    try {
        const res = await dynamoClient.send(new QueryCommand(params));
        console.log(res.Items);
        return res.Items;
    } catch (error) {
        console.error('Failed to retrieve leaderbord data', error);
        throw error;
    }
}

//need to have every importnat detail to env going forward
//streaks  will be
