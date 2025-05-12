export type EruditDependencyOptions = Partial<{
    transpile: boolean;
    optimize: boolean;
}>;

export type EruditDependencies = Record<string, EruditDependencyOptions>;
