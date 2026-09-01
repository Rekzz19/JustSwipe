import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Game, { type Question } from './page';

const push = jest.fn();
const fetchMock = jest.fn();

const mockQuestions: Question[] = Array.from({ length: 6 }, (_, index) => ({
    active: true,
    options: [
        { id: 'A', text: `Incorrect answer ${index + 1}` },
        { id: 'B', text: `Correct answer ${index + 1}` },
    ],
    correctOptionId: 'B',
    category: 'NBA',
    question: `Test question ${index + 1}?`,
    ID: `q-${index + 1}`,
    imageA: `/images/player-a-${index + 1}.jpg`,
    imageB: `/images/player-b-${index + 1}.jpg`,
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push }),
}));

jest.mock('../components/playerQuestions/Questions', () => ({
    __esModule: true,
    default: ({ question, handleSwipe }: { question: Question; handleSwipe: (direction: string) => void }) => {
        const correctDirection = question.correctOptionId === 'A' ? 'left' : 'right';
        const incorrectDirection = correctDirection === 'left' ? 'right' : 'left';

        return (
            <section>
                <p>{question.question}</p>
                <button onClick={() => handleSwipe(correctDirection)}>Correct swipe</button>
                <button onClick={() => handleSwipe(incorrectDirection)}>Incorrect swipe</button>
            </section>
        );
    },
}));

jest.mock('../components/questionTimer/Timer', () => ({
    __esModule: true,
    default: ({ timer, swipeCount, onTimeUp }: { timer: number; swipeCount: number; onTimeUp: () => void }) => (
        <section>
            <p>Timer: {timer}</p>
            <p>Swipes: {swipeCount}</p>
            <button onClick={onTimeUp}>Time up</button>
        </section>
    ),
}));

beforeEach(() => {
    push.mockClear();
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ questions: mockQuestions }),
    } as Response);
    global.fetch = fetchMock as typeof fetch;
});

test('loads the first question with a five-second timer and no completed swipes', async () => {
    render(<Game />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(await screen.findByText('Test question 1?')).toBeInTheDocument();
    expect(screen.getByText('Timer: 5')).toBeInTheDocument();
    expect(screen.getByText('Swipes: 0')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith('/api/questions');
});

test('five correct swipes contribute to the final score', async () => {
    render(<Game />);
    await screen.findByText('Test question 1?');

    for (let swipe = 1; swipe <= 5; swipe += 1) {
        fireEvent.click(screen.getByRole('button', { name: 'Correct swipe' }));
        expect(screen.getByText(`Swipes: ${swipe}`)).toBeInTheDocument();
    }

    await waitFor(() => {
        expect(push).toHaveBeenCalledWith('/score?score=5');
    });
});

test('incorrect swipes do not increase the final score', async () => {
    render(<Game />);
    await screen.findByText('Test question 1?');

    for (let swipe = 1; swipe <= 5; swipe += 1) {
        fireEvent.click(screen.getByRole('button', { name: 'Incorrect swipe' }));
    }

    await waitFor(() => {
        expect(push).toHaveBeenCalledWith('/score?score=0');
    });
});

test('a timeout resets the timer, advances the question, and counts as a turn', async () => {
    render(<Game />);
    await screen.findByText('Test question 1?');

    fireEvent.click(screen.getByRole('button', { name: 'Time up' }));

    expect(screen.getByText('Test question 2?')).toBeInTheDocument();
    expect(screen.getByText('Timer: 5')).toBeInTheDocument();
    expect(screen.getByText('Swipes: 1')).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
});

test('five timeouts finish the game without awarding points', async () => {
    render(<Game />);
    await screen.findByText('Test question 1?');

    for (let turn = 0; turn < 5; turn += 1) {
        fireEvent.click(screen.getByRole('button', { name: 'Time up' }));
    }

    await waitFor(() => {
        expect(push).toHaveBeenCalledWith('/score?score=0');
    });
});
