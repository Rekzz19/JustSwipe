import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Game from './page';
import type { Question } from './types';
import { calculateScore } from './calculateScore';

const push = jest.fn();
const redirectMock = jest.fn();
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
    redirect: (path: string) => redirectMock(path),
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
    redirectMock.mockClear();
    fetchMock.mockReset();
    fetchMock.mockImplementation(async (url: string, options?: RequestInit) => {
        switch (url) {
            case '/api/checkUserState':
                return { ok: true, status: 200, json: async () => ({ played: false }) };
            case '/api/questions':
                return { ok: true, status: 200, json: async () => ({ questions: mockQuestions }) };
            case '/api/postScore':
                return {
                    ok: true,
                    status: 201,
                    json: async () => ({
                        score: calculateScore(JSON.parse(options?.body as string).userAns, mockQuestions),
                    }),
                };
            default:
                throw new Error(`Unexpected request: ${url}`);
        }
    });
    global.fetch = fetchMock as typeof fetch;
});

test('loads the first question with a five-second timer and no completed swipes', async () => {
    render(<Game />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(await screen.findByText('Test question 1?')).toBeInTheDocument();
    expect(screen.getByText('Timer: 5')).toBeInTheDocument();
    expect(screen.getByText('Swipes: 0')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith('/api/questions');
    expect(fetchMock).toHaveBeenCalledWith('/api/checkUserState');
    expect(redirectMock).not.toHaveBeenCalled();
});

test('five correct swipes contribute to the final score', async () => {
    render(<Game />);
    await screen.findByText('Test question 1?');

    for (let swipe = 1; swipe <= 5; swipe += 1) {
        fireEvent.click(screen.getByRole('button', { name: 'Correct swipe' }));
        if (swipe < 5) expect(screen.getByText(`Swipes: ${swipe}`)).toBeInTheDocument();
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

test('mixed swipes and timeouts submit five distinct results and stop play', async () => {
    render(<Game />);
    await screen.findByText('Test question 1?');
    for (const action of ['Correct swipe', 'Time up', 'Incorrect swipe', 'Time up', 'Correct swipe']) {
        fireEvent.click(screen.getByRole('button', { name: action }));
    }
    expect(screen.queryByRole('button', { name: 'Time up' })).not.toBeInTheDocument();
    await waitFor(() => expect(push).toHaveBeenCalledWith('/score?score=2'));
    const submissions = fetchMock.mock.calls.filter(([url]) => url === '/api/postScore');
    expect(submissions).toHaveLength(1);
    expect(JSON.parse(submissions[0][1].body).userAns).toEqual([
        { questionID: 'q-1', answerDir: 'right' },
        { questionID: 'q-2', answerDir: null },
        { questionID: 'q-3', answerDir: 'left' },
        { questionID: 'q-4', answerDir: null },
        { questionID: 'q-5', answerDir: 'right' },
    ]);
});

test('redirects home when the user has already played', async () => {
    const defaultFetch = fetchMock.getMockImplementation();
    fetchMock.mockImplementation((url: string, options?: RequestInit) =>
        url === '/api/checkUserState'
            ? Promise.resolve({ ok: true, status: 200, json: async () => ({ played: true }) })
            : defaultFetch!(url, options)
    );
    render(<Game />);
    await waitFor(() => expect(redirectMock).toHaveBeenCalledWith('/'));
    expect(fetchMock.mock.calls.some(([url]) => url === '/api/postScore')).toBe(false);
});

test('displays a submission error without navigating to the score page', async () => {
    const defaultFetch = fetchMock.getMockImplementation();
    fetchMock.mockImplementation((url: string, options?: RequestInit) =>
        url === '/api/postScore'
            ? Promise.resolve({ ok: false, status: 503, json: async () => ({ error: 'Unable to save score' }) })
            : defaultFetch!(url, options)
    );
    render(<Game />);
    await screen.findByText('Test question 1?');
    for (let turn = 0; turn < 5; turn += 1) {
        fireEvent.click(screen.getByRole('button', { name: 'Time up' }));
    }
    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to save score');
    expect(push).not.toHaveBeenCalled();
});
