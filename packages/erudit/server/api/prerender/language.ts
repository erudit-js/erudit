import { ERUDIT_SERVER } from '@server/global';

export default defineEventHandler(() => {
    const phraseRoutes = Object.keys(ERUDIT_SERVER.LANGUAGE?.phrases || []).map(
        (phraseId) => `/api/language/phrase/${phraseId}`,
    );

    return ['/api/language/functions', ...phraseRoutes];
});
