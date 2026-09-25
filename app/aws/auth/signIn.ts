import {
    AuthFlowType,
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { cookies } from 'next/headers';

interface authType {
    username: string;
    password: string;
}

export async function initiateAuth({ username, password }: authType) {
    const client = new CognitoIdentityProviderClient({
        region: 'us-east-1',
    });

    const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
        },
        ClientId: '7svqjqvhdohgddq5088ptfl71k',
    });

    const response = await client.send(command);
    //console.log('sign-in', response);

    //---COOKIES---
    const accessToken = response.AuthenticationResult?.AccessToken;
    if (accessToken) {
        const cookieStore = await cookies();

        cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60,
        });
    }

    return response;
}
