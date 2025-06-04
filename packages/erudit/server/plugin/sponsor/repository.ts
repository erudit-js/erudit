import type { SponsorConfig, Sponsor } from '@erudit-js/cog/schema';

import { PROJECT_DIR } from '#erudit/globalPaths';
import { ERUDIT_SERVER } from '@server/global';
import { IMPORT } from '@server/importer';

export function getSponsorIds() {
    const sponsors = ERUDIT_SERVER?.SPONSORS;

    if (!sponsors) {
        return [];
    }

    const tier1Ids = sponsors.tier1Ids || [];
    const tier2Ids = sponsors.tier2Ids || [];

    return [...tier1Ids, ...tier2Ids];
}

export function getSponsorCount() {
    return getSponsorIds().length;
}

export async function readSponsorConfig(sponsorId: string) {
    const config = (await IMPORT(
        `${PROJECT_DIR}/sponsors/${sponsorId}/sponsor`,
        { default: true },
    )) as SponsorConfig<Sponsor>;

    return config;
}

export async function retrieveSponsor(sponsorId: string): Promise<Sponsor> {
    const config = await readSponsorConfig(sponsorId);
    const avatar = ERUDIT_SERVER.SPONSORS?.avatars[sponsorId];

    if (!config) {
        throw new Error(`Sponsor config not found for ID: ${sponsorId}`);
    }

    return {
        ...config,
        sponsorId,
        avatar,
    };
}

export function getTier2SponsorIds() {
    const sponsors = ERUDIT_SERVER?.SPONSORS;

    if (!sponsors) {
        return [];
    }

    return sponsors.tier2Ids || [];
}
