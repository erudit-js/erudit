import type { GlobalLinkTypeguard } from '../prose/link.js';

export interface ContentDependency {
    dependency: GlobalLinkTypeguard;
    reason: string;
}
