import { getContributions } from '@server/repository/contributor';
import type { AsideMinorContributor } from '@erudit/shared/aside/minor';

export default defineEventHandler(async (event) => {
    const contributorId = event.context.params?.contributorId;

    if (!contributorId) {
        throw createError({
            statusCode: 400,
            message: 'Missing contributor ID!',
        });
    }

    return {
        type: 'contributor',
        contributions: await getContributions(contributorId),
    } satisfies AsideMinorContributor;
});
