export const contentFlags = ['dev', 'advanced', 'secondary'] as const;

export type ContentFlag = (typeof contentFlags)[number];

export type ContentFlags = Partial<Record<ContentFlag, boolean>>;
