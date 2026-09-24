import { storeScore } from '@/app/aws/score/storeDynamodbUserScore';
import { verifyJwt } from '@/app/aws/auth/jwt';
import { cookies } from 'next/headers';

interface ScoreType {
    score: number;
}

export async function POST(request: Request) {
    try {
        //check cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken')?.value;

        console.log('Access-token cookie exists:', Boolean(token));

        if (!token) {
            return Response.json({ error: 'Not authenticated' }, { status: 401 });
        }
        const payload = await verifyJwt(token);

        if (!payload?.username || !payload?.sub) {
            return Response.json({ message: 'missing username or sub' });
        }

        const { score } = (await request.json()) as ScoreType;

        await storeScore({ username: payload?.username, sub: payload?.sub, score });
        return Response.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error('Unable to store score:', error);

        return Response.json({ error: 'Unable to store score' }, { status: 500 });
    }
}
