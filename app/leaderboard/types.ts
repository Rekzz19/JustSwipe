export const LEADERBOARD_LIMIT = 7;

export interface LeaderboardEntry {
    userId: string;
    recordId: string;
    username: string;
    score: number;
}

export function isLeaderboardEntry(value: unknown): value is LeaderboardEntry {
    if (typeof value !== 'object' || value === null) return false;
    return (
        'userId' in value &&
        typeof value.userId === 'string' &&
        'recordId' in value &&
        typeof value.recordId === 'string' &&
        'username' in value &&
        typeof value.username === 'string' &&
        'score' in value &&
        typeof value.score === 'number' &&
        Number.isFinite(value.score) &&
        value.score >= 0
    );
}
