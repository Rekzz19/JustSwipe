import { CognitoIdentityProviderClient, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';

const config = {
    region: 'us-east-1',
};
const client = new CognitoIdentityProviderClient(config);

interface cogSignUpType {
    username: string;
    password: string;
    email: string;
}

export async function cognitoSignUp({ username, password, email }: cogSignUpType) {
    try {
        const input = {
            ClientId: '7svqjqvhdohgddq5088ptfl71k',
            Username: username, // required
            Password: password,
            UserAttributes: [
                // AttributeListType
                {
                    // AttributeType
                    Name: 'email', // required
                    Value: email,
                },
            ],
        };
        const command = new SignUpCommand(input);
        const response = await client.send(command);
        //console.log('awsResult', response);
        return response;
    } catch (err) {
        console.error('Sign-up failed:', err);
    }
}

//this is signup
