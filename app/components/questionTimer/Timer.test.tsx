import { act, render, screen } from '@testing-library/react';
import { useState } from 'react';
import Timer from './Timer';

const onTimeUp = jest.fn();

function TimerHarness({ initialTimer = 5, swipeCount = 0 }: { initialTimer?: number; swipeCount?: number }) {
    const [timer, setTimer] = useState(initialTimer);

    return <Timer timer={timer} setTimer={setTimer} swipeCount={swipeCount} onTimeUp={onTimeUp} />;
}

beforeEach(() => {
    jest.useFakeTimers();
    onTimeUp.mockClear();
});

afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
});

test('renders the current timer value', () => {
    render(<TimerHarness initialTimer={5} />);

    expect(screen.getByText('5')).toBeInTheDocument();
});

test('decrements the timer once per second', () => {
    render(<TimerHarness initialTimer={5} />);

    act(() => {
        jest.advanceTimersByTime(2000);
    });

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(onTimeUp).not.toHaveBeenCalled();
});

test('calls onTimeUp once when the timer reaches zero', () => {
    render(<TimerHarness initialTimer={2} />);

    act(() => {
        jest.advanceTimersByTime(2000);
    });

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(onTimeUp).toHaveBeenCalledTimes(1);

    act(() => {
        jest.advanceTimersByTime(3000);
    });

    expect(onTimeUp).toHaveBeenCalledTimes(1);
});

test('restarts with a single interval when swipeCount changes', () => {
    const { rerender } = render(<TimerHarness swipeCount={0} />);

    act(() => {
        jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('4')).toBeInTheDocument();

    rerender(<TimerHarness swipeCount={1} />);
    act(() => {
        jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('3')).toBeInTheDocument();
});

test('cleans up its interval when unmounted', () => {
    const { unmount } = render(<TimerHarness />);

    unmount();

    expect(jest.getTimerCount()).toBe(0);
});
