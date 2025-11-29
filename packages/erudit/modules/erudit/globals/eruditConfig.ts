import { defu } from 'defu';
import type { EruditConfig } from '@erudit-js/core/eruditConfig/config';

export function defineEruditConfig(
    eruditConfig: Partial<EruditConfig> | Partial<EruditConfig>[],
) {
    const configs = Array.isArray(eruditConfig) ? eruditConfig : [eruditConfig];
    // @ts-ignore
    return defu(...configs.reverse());
}
