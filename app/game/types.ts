export interface Option {
    id: string;
    text: string;
}

export interface Question {
    active: boolean;
    options: Option[];
    correctOptionId: string;
    category: string;
    question: string;
    ID: string;
    imageA: string;
    imageB: string;
}

export interface Answer {
    questionID: string;
    answerDir: 'left' | 'right' | null;
}
