export interface EruditDebug {
  log?: boolean;
  slowTransition?: boolean;
  fakeApi?: Partial<{
    repository: boolean;
    lastChanged: boolean | string;
  }>;
  ads?: boolean;
  analytics?: boolean;
}
