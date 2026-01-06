import type { PageSponsor } from '@erudit-js/core/sponsor';

export default defineEventHandler<Promise<PageSponsor[]>>(async (event) => {
    const pageSponsors: PageSponsor[] = [];
    const dbSponsors = await ERUDIT.db.query.sponsors.findMany();

    for (const dbSponsor of dbSponsors) {
        const pageSponsor: PageSponsor = {
            name: dbSponsor.data.name ?? dbSponsor.sponsorId,
        };

        // Try get info
        if (dbSponsor.data.info) {
            pageSponsor.info = dbSponsor.data.info;
        }

        // If has messages, treat random message as info
        if (dbSponsor.data.messages?.enabled) {
            if (dbSponsor.data.messages.list) {
                pageSponsor.info =
                    dbSponsor.data.messages.list[
                        Math.floor(
                            Math.random() * dbSponsor.data.messages.list.length,
                        )
                    ];
            }
        }

        if (dbSponsor.data.link) {
            pageSponsor.link = dbSponsor.data.link;
        }

        if (dbSponsor.data.icon) {
            pageSponsor.icon = dbSponsor.data.icon;
        }

        if (dbSponsor.data.avatarExtension) {
            pageSponsor.avatarUrl = ERUDIT.repository.sponsors.avatarUrl(
                dbSponsor.sponsorId,
                dbSponsor.data.avatarExtension,
            );
        }

        if (dbSponsor.data.color) {
            pageSponsor.color = dbSponsor.data.color;
        }

        if (dbSponsor.data.group) {
            pageSponsor.group = dbSponsor.data.group;
        }

        pageSponsors.push(pageSponsor);
    }

    return pageSponsors;
});
