import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { Question } from '../game/page';

//created client
const s3Client = new S3Client({
    region: 'eu-north-1',
});

//incoming data - array of objects [ {}, {}, ]
export async function getS3PlayerImages(questions: Question[]) {
    for (const question of questions) {
        question.imageA = await getS3Url(question.imageA);
        question.imageB = await getS3Url(question.imageB);
    }

    return questions;
}

async function getS3Url(imageKey: string): Promise<string> {
    const getObjectParams = {
        Bucket: 'jusswipe-s3-bucket',
        Key: imageKey,
    };

    const command = new GetObjectCommand(getObjectParams);

    return await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
    });
}
