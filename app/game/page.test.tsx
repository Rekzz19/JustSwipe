import { fireEvent, render, screen } from '@testing-library/react';
import Game, { type Question } from './page';

const push = jest.fn();
const getRandomIndex = jest.fn<number, [number]>(() => 0);

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push }),
}));

jest.mock('@/utils/getRandomIndex', () => ({
    getRandomIndex: (length: number) => getRandomIndex(length),
}));

jest.mock('../components/playerQuestions/Questions', () => ({
    __esModule: true,
    default: ({ question, handleSwipe }: { question: Question; handleSwipe: (direction: string) => void }) => (
        <section>
            <p>{question.question}</p>
            <button onClick={() => handleSwipe(question.answer.position)}>Correct swipe</button>
            <button onClick={() => handleSwipe(question.answer.position === 'left' ? 'right' : 'left')}>
                Incorrect swipe
            </button>
        </section>
    ),
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
    getRandomIndex.mockClear();
    getRandomIndex.mockReturnValue(0);
});

test('starts with a question, a five-second timer, and no completed swipes', () => {
    render(<Game />);

    expect(screen.getByText('Who won the NBA Finals MVP in 2019?')).toBeInTheDocument();
    expect(screen.getByText('Timer: 5')).toBeInTheDocument();
    expect(screen.getByText('Swipes: 0')).toBeInTheDocument();
    expect(getRandomIndex).toHaveBeenCalledWith(15);
});

test('a correct swipe advances the game and contributes to the final score', () => {
    render(<Game />);

    for (let swipe = 1; swipe <= 5; swipe += 1) {
        fireEvent.click(screen.getByRole('button', { name: 'Correct swipe' }));
        expect(screen.getByText(`Swipes: ${swipe}`)).toBeInTheDocument();
    }

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith('/score?score=5');
});

test('an incorrect swipe advances the game without increasing the score', () => {
    render(<Game />);

    for (let swipe = 1; swipe <= 5; swipe += 1) {
        fireEvent.click(screen.getByRole('button', { name: 'Incorrect swipe' }));
    }

    expect(push).toHaveBeenCalledWith('/score?score=0');
});

test('a timeout resets the timer, advances the question, and counts as a turn', () => {
    getRandomIndex.mockReturnValueOnce(0).mockReturnValueOnce(1);
    render(<Game />);

    fireEvent.click(screen.getByRole('button', { name: 'Time up' }));

    expect(screen.getByText('Who scored 81 points in a single NBA game?')).toBeInTheDocument();
    expect(screen.getByText('Timer: 5')).toBeInTheDocument();
    expect(screen.getByText('Swipes: 1')).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
});

test('timeouts do not award points', () => {
    render(<Game />);

    for (let turn = 0; turn < 5; turn += 1) {
        fireEvent.click(screen.getByRole('button', { name: 'Time up' }));
    }

    expect(push).toHaveBeenCalledWith('/score?score=0');
});
