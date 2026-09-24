import { initiateAuth } from '../../../aws/auth/signIn';

interface SignInBody {
    username: string;
    password: string;
}

export async function POST(request: Request) {
    //get out the body
    try {
        const { username, password } = (await request.json()) as SignInBody;

        if (!username || !password) {
            return Response.json({ message: 'Username and password are required' }, { status: 400 });
        }

        await initiateAuth({ username, password });
        return Response.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Sign-in failed', error);

        return Response.json({ message: 'Invalid username or password' }, { status: 401 });
    }
}
