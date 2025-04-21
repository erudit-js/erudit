import type { ProblemLevel } from '../shared';

export interface LevelFront {
    color: string;
}

export const levelFront: Record<ProblemLevel, LevelFront> = {
    easy: {
        color: 'light-dark( #73af00, #79b800)',
    },
    medium: {
        color: 'light-dark( #db9c00, #ffc01e)',
    },
    hard: {
        color: 'light-dark( #dc2f51, #ff375f)',
    },
};
