import { getContributorPageData } from '@server/repository/contributor';

export default defineEventHandler(async (event) => {
    const contributorId = event.context.params?.contributorId;

    if (!contributorId) {
        throw createError({
            statusCode: 400,
            message: 'Missing contributor ID!',
        });
    }

    return await getContributorPageData(contributorId);
});
