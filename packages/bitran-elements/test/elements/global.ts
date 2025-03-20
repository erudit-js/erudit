import type { EruditConfig } from '@erudit-js/cog/schema';

export function resetEruditGlobals() {
    globalThis.useEruditConfig = () => ({});
}

export function setEruditConfig(config: Partial<EruditConfig>) {
    globalThis.useEruditConfig = () => config;
}
