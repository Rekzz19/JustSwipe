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

/* have a function that for a given sub, is there a score with todays date, if so 
no game 

ALSO at the poinyt of scoring if they is a record decline it 

Non authorised users 

*/
