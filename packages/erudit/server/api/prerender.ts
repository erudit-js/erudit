import { ERUDIT_SERVER } from '@server/global';

export default defineEventHandler(async () => {
    const routes: string[] = [];
    routes.push(...language());

    return routes;
});

//
//
//

function language() {
    const phraseRoutes = Object.keys(ERUDIT_SERVER.LANGUAGE?.phrases || []).map(
        (phraseId) => `/api/language/phrase/${phraseId}`,
    );
    return ['/api/language/functions', ...phraseRoutes];
}
