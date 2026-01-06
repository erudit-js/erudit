import { eq } from 'drizzle-orm';
import {
    parseQuoteId,
    type CameoQuote,
    type Quote,
    type SponsorQuote,
} from '@erudit-js/core/quote';

export default defineEventHandler<Promise<Quote>>(async (event) => {
    const quoteId = event.context.params?.quoteId;

    if (!quoteId) {
        throw createError({
            statusCode: 400,
            message: 'Quote ID is required!',
        });
    }

    const { type, id } = parseQuoteId(quoteId);

    if (type === 'cameo') {
        const dbCameo = await ERUDIT.db.query.cameos.findFirst({
            columns: { data: true },
            where: eq(ERUDIT.db.schema.cameos.cameoId, id),
        });

        if (!dbCameo) {
            throw createError({
                statusCode: 404,
                message: `Failed to find cameo with ID "${id}"!`,
            });
        }

        const data = dbCameo.data;

        const quote: CameoQuote = {
            type: 'cameo',
            name: data.name,
            messages: data.messages,
            icon: data.icon,
            color: data.color,
            link: data.link,
            avatarUrl: `/file/cameos/${id}/avatar.${data.avatarExtension}`,
        };

        return quote;
    } else if (type === 'sponsor') {
        const dbSponsor = await ERUDIT.db.query.sponsors.findFirst({
            columns: { data: true },
            where: eq(ERUDIT.db.schema.sponsors.sponsorId, id),
        });

        if (!dbSponsor) {
            throw createError({
                statusCode: 404,
                message: `Failed to find cameo with ID "${id}"!`,
            });
        }

        const data = dbSponsor.data;

        const quote: SponsorQuote = {
            type: 'sponsor',
            name: data.name ?? id,
            color: data.color,
            icon: data.icon,
            link: data.link,
            avatarUrl: ERUDIT.repository.sponsors.avatarUrl(
                id,
                data.avatarExtension,
            ),
        };

        if (data.messages?.enabled === true) {
            if (data.messages.list) {
                quote.messages = data.messages.list;
            }
        }

        return quote;
    }

    throw createError({
        statusCode: 400,
        message: `Unable to resolve quote ID "${quoteId}"!`,
    });
});
