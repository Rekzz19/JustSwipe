import type { Answer, Question } from './types';

export class InvalidAnswersError extends Error {}

// Validation and calculation are synchronous: neither needs a network request.
export function calculateScore(answers: unknown, questions: Question[]): number {
    runtimeCheck(answers);

    let score = 0;
    const seenQuestionIds = new Set<string>();

    for (const answer of answers) {
        const question = questions.find((question) => question.ID === answer.questionID);
        if (!question || seenQuestionIds.has(answer.questionID)) {
            throw new InvalidAnswersError('Unknown or duplicate question ID');
        }
        seenQuestionIds.add(answer.questionID);

        if (answer.answerDir === null) {
            continue; // Timed-out question earns zero points.
        }

        const selectedOptionId = answer.answerDir === 'left' ? 'A' : 'B';
        if (selectedOptionId === question.correctOptionId) {
            score += 1;
        }
    }

    return score;
}

function runtimeCheck(answers: unknown): asserts answers is Answer[] {
    if (!Array.isArray(answers)) {
        throw new InvalidAnswersError('Answers must be an array');
    }

    if (answers.length !== 5) {
        throw new InvalidAnswersError('A completed round must contain exactly five answers');
    }

    for (const answer of answers) {
        if (
            typeof answer !== 'object' ||
            answer === null ||
            Array.isArray(answer) ||
            typeof answer.questionID !== 'string' ||
            answer.questionID.trim() === '' ||
            (answer.answerDir !== 'left' && answer.answerDir !== 'right' && answer.answerDir !== null)
        ) {
            throw new InvalidAnswersError(
                'Each answer must contain a non-empty questionID and a left, right, or null answerDir'
            );
        }
    }
}
