import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import Leaderboard from './page';

const fetchMock = jest.fn();
const entries = Array.from({ length: 9 }, (_, index) => ({
    userId: `user-${index}`,
    recordId: '2026-10-07',
    username: `Player ${index + 1}`,
    score: 9 - index,
}));

beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock;
});

function respond(Items: unknown[]) {
    return { ok: true, json: async () => ({ Items }) };
}

test('renders at most seven rows with ranks and Game IQ placeholders', async () => {
    fetchMock.mockResolvedValue(respond(entries));
    render(<Leaderboard />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    const table = await screen.findByRole('table');
    await screen.findByText('Player 7');
    expect(within(table).getAllByRole('row')).toHaveLength(8);
    expect(screen.queryByText('Player 8')).not.toBeInTheDocument();
    expect(screen.getAllByLabelText('Game IQ coming soon')).toHaveLength(7);
    expect(fetchMock).toHaveBeenCalledWith('/api/getLeaderboard', expect.objectContaining({ cache: 'no-store' }));
});

test('renders one zero-score record without filler rows', async () => {
    fetchMock.mockResolvedValue(respond([{ ...entries[0], score: 0 }]));
    render(<Leaderboard />);
    await screen.findByText('Player 1');
    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(screen.getByText('0')).toBeInTheDocument();
});

test('shows an empty state', async () => {
    fetchMock.mockResolvedValue(respond([]));
    render(<Leaderboard />);
    expect(await screen.findByText(/No scores yet/)).toBeInTheDocument();
});

test('handles a failed response and allows retry', async () => {
    const log = jest.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockResolvedValueOnce({ ok: false, status: 503 }).mockResolvedValueOnce(respond(entries.slice(0, 1)));
    render(<Leaderboard />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load');
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    await screen.findByText('Player 1');
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
    log.mockRestore();
});

test('rejects malformed leaderboard data', async () => {
    const log = jest.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockResolvedValue(respond([{ username: 'Player', score: 'bad' }]));
    render(<Leaderboard />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    log.mockRestore();
});
