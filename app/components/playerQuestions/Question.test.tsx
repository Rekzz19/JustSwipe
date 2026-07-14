import { render, screen } from '@testing-library/react';
import Questions from './Questions';
import { Question } from '@/app/game/page';

const mockQuestions: Question = {
    question: 'who am i?',
    answer: { name: 'Kawhi Leonard', position: 'left' },
    option: 'me',
    imageA: 'images/Kawhi.jpeg',
    imageB: 'images/Klay.jpeg',
};

const mockSwipe: (direction: string) => void = () => {};

test('renders question text', async () => {
    render(<Questions question={mockQuestions} handleSwipe={mockSwipe} />);

    const questionText = await screen.findByText(/who am i/i);

    expect(questionText).toBeInTheDocument();
});

test('renders two images', async () => {
    render(<Questions question={mockQuestions} handleSwipe={mockSwipe} />);

    const images = await screen.findAllByRole('img');

    expect(images.length).toBe(2);
});
