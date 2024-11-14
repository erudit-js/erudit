import type { EruditPhraseId } from '@shared/types/language';
import { ERUDIT_SERVER } from '@server/global';

export default defineEventHandler((event) => {
    setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8');

    const phraseId = getRouterParam(event, 'phraseId');
    const phrase =
        ERUDIT_SERVER.LANGUAGE?.phrases?.[phraseId as EruditPhraseId];

    if (typeof phrase === 'string') return phrase;
    else if (typeof phrase === 'function')
        return '~!~FUNC~!~' + 'return ' + phrase.toString();

    throw createError({
        statusCode: 400,
        statusText: `Unknown phrase id "${phraseId}"!`,
    });
});
