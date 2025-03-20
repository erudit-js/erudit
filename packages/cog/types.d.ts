import type { EruditConfig } from './dist/schema';

declare global {
    function useEruditConfig(): Partial<EruditConfig>;
}
