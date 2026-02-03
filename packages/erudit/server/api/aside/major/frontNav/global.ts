import { getGlobalFrontContentNav } from '#layers/erudit/server/erudit/content/nav/front';

export default defineEventHandler<Promise<FrontGlobalContentNav>>(async () => {
  return await getGlobalFrontContentNav();
});
