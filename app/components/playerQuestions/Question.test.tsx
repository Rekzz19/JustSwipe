import { render, screen } from '@testing-library/react';
import Questions from './Questions';
import { Question } from '@/app/game/page';

const mockQuestions: Question = {
    active: true,
    options: [
        {
            id: 'A',
            text: 'Kawhi',
        },
        {
            id: 'B',
            text: 'Klay',
        },
    ],
    correctOptionId: 'A',
    category: 'NBA',
    question: 'Who won the NBA Finals MVP in 2019?',
    ID: '1',
    imageA: 'images/Kawhi.jpeg',
    imageB: 'images/Klay.jpeg',
};

const mockSwipe: (direction: string) => void = () => {};

test('renders question text', async () => {
    render(<Questions question={mockQuestions} handleSwipe={mockSwipe} />);

    const questionText = await screen.findByText(mockQuestions.question);

    expect(questionText).toBeInTheDocument();
});

test('renders two images', async () => {
    render(<Questions question={mockQuestions} handleSwipe={mockSwipe} />);

    const images = await screen.findAllByRole('img');

    expect(images.length).toBe(2);
});
