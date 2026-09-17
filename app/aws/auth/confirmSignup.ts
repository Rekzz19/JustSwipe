import { ConfirmSignUpCommand, CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

/** snippet-start:[javascript.v3.cognito-idp.actions.ConfirmSignUp] */

interface confirmType {
    clientId: string;
    username: string;
    code: string;
}
export async function confirmSignUp({ clientId, username, code }: confirmType) {
    const client = new CognitoIdentityProviderClient({
        region: 'us-east-1',
    });

    const command = new ConfirmSignUpCommand({
        ClientId: clientId,
        Username: username,
        ConfirmationCode: code,
    });

    const response = await client.send(command);
    //console.log(response);
    return response;
}
