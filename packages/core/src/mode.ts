export type EruditMode = 'dev' | 'write' | 'static';

export function isDevLikeMode(mode: EruditMode): boolean {
  return mode === 'dev' || mode === 'write';
}
