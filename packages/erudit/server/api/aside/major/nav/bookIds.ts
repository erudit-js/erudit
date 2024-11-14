import { ERUDIT_SERVER } from '@server/global';

export default defineEventHandler(() => {
    return Object.keys(ERUDIT_SERVER.NAV_BOOKS || {});
});
