import { dynamoClient } from '@/config/dynamodbClient';
import { GetCommand } from '@aws-sdk/lib-dynamodb';

export async function userState(userSub: string) {
    const todaysDate = new Date().toISOString().split('T')[0];

    const params = {
        TableName: 'jusswipe-score-dynamodb',
        Key: {
            userId: userSub,
            recordId: '2026-09-24',
        },
    };

    try {
        const res = await dynamoClient.send(new GetCommand(params));
        console.log('this ', res);
        return res;
    } catch (error) {
        console.error('Failed to validate user state', error);
        console.log(error);
        throw error;
    }
}

//you can use a try clock so that you can catch any errors and it passed down the route.
//NEXT handle unauthorised user errors and ensure score of the same date is handled.
//ensure guest players only play once.
