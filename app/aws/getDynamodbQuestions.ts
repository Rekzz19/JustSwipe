import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { GetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const config: DynamoDBClientConfig = { region: 'us-east-1' };
const client = new DynamoDBClient(config);
const docClient = DynamoDBDocumentClient.from(client); //high level client

//todays date
const today = new Date().toISOString().split('T')[0];
//console.log(today);

//questions interface/type

async function getQuestions() {
    //give return type for function
    //create env variables for the table and region
    const params = {
        TableName: 'jusswipe-daily-questions',
        Key: {
            date: today,
        },
    };

    try {
        const response = await docClient.send(new GetCommand(params));
        console.log(response.Item);
        console.log('result : ' + JSON.stringify(response));
        //handle missing item (i.e item could be undefined)
    } catch (err) {
        console.error('Failed to retrieve questions:', err);
    }
}

getQuestions();
