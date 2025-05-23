export interface EruditDebug {
    log?: boolean;
    slowTransition?: boolean;
    fakeApi?: Partial<{
        repository: boolean;
        languages: boolean;
    }>;
    ads?: boolean;
    analytics?: boolean;
}
