import { getQuestions } from '@/app/aws/getDynamodbQuestions';
import { getS3PlayerImages } from '@/app/aws/getS3PlayerImages';

export async function GET() {
    const questions = await getQuestions();

    const response = await getS3PlayerImages(questions);
    //console.log('API:' + response);
    console.log(response);

    return Response.json({
        questions: response ?? [],
    });
}
