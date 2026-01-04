import { createQuoteId, type QuoteIds } from '@erudit-js/core/quote';

export async function getQuoteIds(): Promise<QuoteIds> {
    const ids: QuoteIds = {};

    const dbCameos = await ERUDIT.db.query.cameos.findMany({
        columns: { cameoId: true },
    });

    if (dbCameos.length > 0) {
        ids.cameo = dbCameos.map((dbCameo) =>
            createQuoteId('cameo', dbCameo.cameoId),
        );
    }

    if (ERUDIT.config.public.project.sponsors?.enabled) {
        const dbSponsors = await ERUDIT.db.query.sponsors.findMany({
            columns: { sponsorId: true },
        });

        if (dbSponsors.length > 0) {
            ids.sponsor = dbSponsors.map((dbSponsor) =>
                createQuoteId('sponsor', dbSponsor.sponsorId),
            );
        }
    }

    return ids;
}
