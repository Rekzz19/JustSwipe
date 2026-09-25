import { DynamoDBClientConfig, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const config: DynamoDBClientConfig = { region: 'us-east-1' };
const client = new DynamoDBClient(config);

export const dynamoClient = DynamoDBDocumentClient.from(client); //high level client
