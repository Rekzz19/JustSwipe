import { dynamoClient } from '@/config/dynamodbClient';
import { TransactWriteCommand, type TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb';

interface StoreScoreType {
    username: string;
    sub: string;
    score: number;
}

export async function storeScore({ username, sub, score }: StoreScoreType) {
    const today = new Date().toISOString().split('T')[0]; //is date consistent across app

    const input: TransactWriteCommandInput = {
        TransactItems: [
            {
                Put: {
                    TableName: 'jusswipe-score-dynamodb',
                    Item: {
                        userId: sub,
                        username,
                        recordId: today,
                        highScore: score,
                    },
                    ConditionExpression: 'attribute_not_exists(userId) AND attribute_not_exists(recordId)',
                },
            },
            {
                Update: {
                    TableName: 'jusswipe-score-dynamodb',
                    Key: {
                        userId: sub,
                        recordId: 'SUMMARY',
                    },

                    UpdateExpression: 'ADD overallScore :score, gamesPlayed :one SET username = :username',

                    ExpressionAttributeValues: {
                        ':score': score,
                        ':one': 1,
                        ':username': username,
                    },
                },
            },
        ],
        //ClientRequestToken: 'idk', //idempotency
    };

    try {
        const command = new TransactWriteCommand(input);
        const response = await dynamoClient.send(command);
        console.log(response);
        return response;
    } catch (err) {
        console.error('Failed to Store score', err);
        throw err;
    }
}
