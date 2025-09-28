import { getGlobalFrontContentNav } from '@erudit/server/content/nav/front';

export default defineEventHandler<Promise<FrontGlobalContentNav>>(async () => {
    return await getGlobalFrontContentNav();
});
