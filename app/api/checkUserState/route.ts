import { cookies } from 'next/headers';
import { verifyJwt } from '../../aws/auth/jwt';
import { userState } from '../../aws/userStateDynamodb/userState';

export async function GET() {
    let userPlayed = false;
    const todaysDate = new Date().toISOString().split('T')[0];
    //check cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    if (!token) {
        return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const payload = await verifyJwt(token);

    if (!payload?.sub) {
        return Response.json({ message: 'missing username or sub' });
    }

    //run dynamodb function that checks the db
    const res = await userState(payload?.sub);

    if (res?.Item) {
        userPlayed = true;
    }

    //console.log('userTest response', res);
    return Response.json({
        played: userPlayed,
    });
}

/**
 * user comes on homw screen, you get play button or score and leaderboard.
 */
