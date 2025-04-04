import { NO_ALIASES, type EruditBitranRuntime } from '@erudit-js/cog/schema';

export const defaultRuntime: EruditBitranRuntime = {
    insideInclude: false,
    context: {
        aliases: NO_ALIASES(),
        location: {
            type: 'article',
            path: 'foo',
        },
    },
    eruditConfig: {},
};
