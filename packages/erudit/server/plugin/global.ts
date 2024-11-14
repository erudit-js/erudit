import type { DataSource } from 'typeorm';
import type { EruditConfig } from 'erudit-cog/schema';

import type { EruditPhrases } from '@shared/types/language';
import type { NavNode, RootNavNode } from '@server/nav/node';
import type { EruditBitranConfig } from '@erudit/globals/bitran';

interface EruditServer {
    BUILD_PROMISE: Promise<void>;
    CONFIG: Partial<EruditConfig>;
    LANGUAGE: { phrases: EruditPhrases; functions: Record<string, Function> };
    DB: DataSource;
    NAV?: RootNavNode;
    NAV_BOOKS?: Record<string, NavNode>;
    BITRAN_CONFIG?: Partial<EruditBitranConfig>;
}

export const ERUDIT_SERVER: EruditServer = {} as any;
