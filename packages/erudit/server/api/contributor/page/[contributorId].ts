import { eq } from 'drizzle-orm';
import type { PageContributor } from '@erudit-js/core/contributor';

export default defineEventHandler<Promise<PageContributor>>(async (event) => {
    const contributorId = event.context.params?.contributorId;

    if (!contributorId) {
        throw createError({
            statusCode: 400,
            message: 'Contributor ID is required!',
        });
    }

    const dbContributor = await ERUDIT.db.query.contributors.findFirst({
        where: eq(ERUDIT.db.schema.contributors.contributorId, contributorId),
    });

    if (!dbContributor) {
        throw createError({
            statusCode: 404,
            message: `Failed to find contributor with ID "${contributorId}"!`,
        });
    }

    const pageContributor: PageContributor = {
        id: dbContributor.contributorId,
    };

    if (dbContributor.displayName) {
        pageContributor.displayName = dbContributor.displayName;
    }

    if (dbContributor.short) {
        pageContributor.short = dbContributor.short;
    }

    if (dbContributor.links) {
        pageContributor.links = dbContributor.links;
    }

    if (dbContributor.avatarExtension) {
        pageContributor.avatarUrl = ERUDIT.repository.contributors.avatarUrl(
            dbContributor.contributorId,
            dbContributor.avatarExtension,
        );
    }

    if (dbContributor.editor) {
        pageContributor.editor = dbContributor.editor;
    }

    return pageContributor;
});
