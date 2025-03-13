import type { FrontNav } from '@erudit/shared/frontNav';
import { ERUDIT_SERVER } from '@server/global';
import { createGlobalFrontNav } from '@server/repository/frontNav';

export default defineEventHandler(async () => {
    return (await createGlobalFrontNav(ERUDIT_SERVER.NAV)) as FrontNav;
});
