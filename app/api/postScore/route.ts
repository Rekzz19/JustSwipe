import { storeScore } from '@/app/aws/score/storeDynamodbUserScore';
import { verifyJwt } from '@/app/aws/auth/jwt';
import { cookies } from 'next/headers';
import { calculateScore, InvalidAnswersError } from '@/app/game/calculateScore';
import { getQuestions } from '@/app/aws/getDynamodbQuestions';
import type { Question } from '@/app/game/types';

export async function POST(request: Request) {
    try {
        const data: unknown = await request.json();
        if (typeof data !== 'object' || data === null || !('userAns' in data)) {
            return Response.json({ error: 'Missing answers' }, { status: 400 });
        }
        const today = new Date().toISOString().split('T')[0];
        const questions: Question[] | undefined = await getQuestions(today);

        if (!questions) {
            return Response.json(
                { error: 'Questions unavailable' },
                { status: 503 } //what is 503
            );
        }

        const score = calculateScore(data.userAns, questions);

        //check cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken')?.value;

        //console.log('Access-token cookie exists:', Boolean(token));

        if (token) {
            const payload = await verifyJwt(token);

            if (!payload?.username || !payload?.sub) {
                return Response.json({ message: 'missing username or sub' });
            }

            await storeScore({ username: payload?.username, sub: payload?.sub, score });
            return Response.json({ success: true, score: score }, { status: 201 }); //what is 201
        } else {
            return Response.json({ score: score });
        }
    } catch (error) {
        if (error instanceof InvalidAnswersError || error instanceof SyntaxError) {
            return Response.json({ error: error.message }, { status: 400 });
        }

        console.error('Unable to store score:', error);

        return Response.json({ error: 'Unable to store score' }, { status: 500 });
    }
}
