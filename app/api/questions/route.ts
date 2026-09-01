import { getQuestions } from '@/app/aws/getDynamodbQuestions';

export async function GET() {
    const response = await getQuestions();
    //console.log('API:' + response);

    return Response.json({
        questions: response ?? [],
    });
}
