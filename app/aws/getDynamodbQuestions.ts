import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { GetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const s3Client = new S3Client({
    region: 'eu-north-1',
}); //created client

const config: DynamoDBClientConfig = { region: 'us-east-1' };
const client = new DynamoDBClient(config);
const docClient = DynamoDBDocumentClient.from(client); //high level client

const today = new Date().toISOString().split('T')[0];

export async function getQuestions() {
    //give return type for function
    //create env variables for the table and region
    const params = {
        TableName: 'jusswipe-daily-questions',
        Key: {
            date: today,
        },
    };

    const getObjectParams = {
        Bucket: 'jusswipe-s3-bucket',
        Key: 'jusswipe-player-images/Kawhi-leonard.jpg',
    };
    const command = new GetObjectCommand(getObjectParams);

    try {
        const response = await docClient.send(new GetCommand(params));
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        console.log(url);
        //console.log(response.Item);
        console.log(response.Item?.questions[0]?.imageA);
        //console.log('result : ' + JSON.stringify(response));
        //handle missing item (i.e item could be undefined)
        return response.Item?.questions;
    } catch (err) {
        console.error('Failed to retrieve questions:', err);
    }
}

getQuestions();
/**
 * for each of the questions from the daily questions you get the url using the object key and then add them to the questions object??
 */
