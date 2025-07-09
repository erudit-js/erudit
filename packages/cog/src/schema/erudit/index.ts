export type EruditIndex = Partial<{
    title: string;
    slogan: string;
    description: string;
    logotype: {
        src: string;
        maxWidth?: string;
        invert?: 'light' | 'dark';
    };
}>;
