import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import PlayersCard from './PlayerCard';

type DragInfo = {
    offset: { x: number };
};

type MotionDivProps = {
    children: ReactNode;
    onDrag?: () => void;
    onDragEnd?: (event: unknown, info: DragInfo) => void;
};

const mockMotionValue = {
    get: jest.fn(() => 0),
    set: jest.fn(),
};
const mockAnimate = jest.fn();
let mockOnDrag: MotionDivProps['onDrag'];
let mockOnDragEnd: MotionDivProps['onDragEnd'];

jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, onDrag, onDragEnd }: MotionDivProps) => {
            mockOnDrag = onDrag;
            mockOnDragEnd = onDragEnd;
            return <div>{children}</div>;
        },
    },
    useMotionValue: () => mockMotionValue,
    useTransform: jest.fn(() => 0),
    animate: (...args: unknown[]) => mockAnimate(...args),
}));

const defaultProps = {
    image: '/images/player.jpg',
    name: 'Test Player',
    onSwipe: jest.fn(),
} as const;

function finishDrag(offsetX: number) {
    if (!mockOnDragEnd) {
        throw new Error('PlayerCard did not provide an onDragEnd handler');
    }

    mockOnDragEnd({}, { offset: { x: offsetX } });
}

beforeEach(() => {
    jest.clearAllMocks();
    mockOnDrag = undefined;
    mockOnDragEnd = undefined;
});

test('reports a left swipe when the left card passes the 50px threshold', () => {
    render(<PlayersCard {...defaultProps} direction="left" />);

    finishDrag(-51);

    expect(defaultProps.onSwipe).toHaveBeenCalledTimes(1);
    expect(defaultProps.onSwipe).toHaveBeenCalledWith('left');
});

test('reports a right swipe when the right card passes the 50px threshold', () => {
    render(<PlayersCard {...defaultProps} direction="right" />);

    finishDrag(51);

    expect(defaultProps.onSwipe).toHaveBeenCalledTimes(1);
    expect(defaultProps.onSwipe).toHaveBeenCalledWith('right');
});

test.each([
    ['left', -50],
    ['left', 60],
    ['right', 50],
    ['right', -60],
] as const)('does not report a swipe for a %s card dragged to %ipx', (direction, offsetX) => {
    render(<PlayersCard {...defaultProps} direction={direction} />);

    finishDrag(offsetX);

    expect(defaultProps.onSwipe).not.toHaveBeenCalled();
});

test('returns the card to its starting position after every drag', () => {
    render(<PlayersCard {...defaultProps} direction="left" />);

    finishDrag(-20);

    expect(mockAnimate).toHaveBeenCalledWith(mockMotionValue, 0, {
        type: 'spring',
        stiffness: 300,
        damping: 25,
    });
});

test.each([
    ['left', 10],
    ['right', -10],
] as const)('prevents the %s card from being dragged in the opposite direction', (direction, position) => {
    mockMotionValue.get.mockReturnValue(position);
    render(<PlayersCard {...defaultProps} direction={direction} />);

    if (!mockOnDrag) {
        throw new Error('PlayerCard did not provide an onDrag handler');
    }
    mockOnDrag();

    expect(mockMotionValue.set).toHaveBeenCalledWith(0);
});
