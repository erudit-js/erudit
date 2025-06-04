import { type Cameo, type Sponsor } from '@erudit-js/cog/schema';

import { retrieveSponsor } from '@server/sponsor/repository';
import { ERUDIT_SERVER } from '@server/global';

export default defineEventHandler<Promise<Cameo>>(async (event) => {
    const sponsorId = event.context.params?.sponsorId;

    if (typeof sponsorId !== 'string' || !sponsorId) {
        throw createError({
            statusCode: 400,
            message: 'Sponsor ID is required and must be a string!',
        });
    }

    let sponsor: Sponsor;
    try {
        sponsor = await retrieveSponsor(sponsorId);
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: `Failed to retrieve sponsor with ID "${sponsorId}"! Error: ${error}`,
        });
    }

    if (sponsor.tier !== 'tier2') {
        throw createError({
            statusCode: 404,
            message: `Sponsor with ID "${sponsorId}" is not a Tier 2 sponsor!`,
        });
    }

    const defaultMessages = ERUDIT_SERVER.CONFIG.sponsors?.defaultCameoMessages;

    if (!defaultMessages) {
        throw createError({
            statusCode: 500,
            message: 'Default sponsor cameo messages are not configured!',
        });
    }

    return {
        cameoId: sponsorId,
        name: sponsor.name,
        icon: sponsor.icon,
        avatars: [sponsor.avatar],
        color: sponsor.color,
        link: sponsor.link,
        messages: [...(sponsor.messages || []), ...defaultMessages],
    } satisfies Cameo;
});
