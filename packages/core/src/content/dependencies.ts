import type { GlobalContentItemTypeguard } from './global.js';

export interface ContentDependency {
    dependency: GlobalContentItemTypeguard;
    reason: string;
}
