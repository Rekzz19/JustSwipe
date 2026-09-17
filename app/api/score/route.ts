import { verifyJwt } from '@/app/aws/auth/jwt';
import { cookies } from 'next/headers';

export async function POST() {
    console.log('POST /api/score reached');

    //check cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    console.log('Access-token cookie exists:', Boolean(token));

    if (!token) {
        return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const payload = await verifyJwt(token);

    if (!payload) {
        return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    console.log(payload?.sub);
    return Response.json({ success: true }, { status: 200 });
}
