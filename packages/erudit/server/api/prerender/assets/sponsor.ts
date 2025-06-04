import { ERUDIT_SERVER } from '@server/global';

export default defineEventHandler(async () => {
    const serverSponsors = ERUDIT_SERVER.SPONSORS;

    if (!serverSponsors) {
        return [];
    }

    return Object.values(serverSponsors.avatars)
        .filter(Boolean)
        .map((avatar) => '/asset/' + avatar);
});
