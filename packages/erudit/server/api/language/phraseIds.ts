import { ERUDIT_SERVER } from '@server/global';
import type { EruditPhraseId } from '@shared/types/language';

export default defineEventHandler(() => {
    return Object.keys(
        ERUDIT_SERVER.LANGUAGE?.phrases || [],
    ) as EruditPhraseId[];
});
