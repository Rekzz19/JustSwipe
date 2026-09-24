import { CognitoJwtVerifier } from 'aws-jwt-verify';

const userPoolId = 'us-east-1_FbgPAG1kA';
const verifier = CognitoJwtVerifier.create({
    userPoolId,
    tokenUse: 'access', // or 'id' for ID tokens
    clientId: '7svqjqvhdohgddq5088ptfl71k',
});

//need the endpoint to call this function
export async function verifyJwt(token: string) {
    try {
        const data = await verifier.verify(token);
        return data;
    } catch (error) {
        console.error('Error verifying jwt:' + error);
        return null;
    }
}
