import { createReadStream, existsSync } from 'node:fs';

export default defineEventHandler(async (event) => {
    const idAndExt = event.context.params?.idAndExt;

    if (!idAndExt) {
        throw createError({
            statusCode: 400,
            message: 'Missing "idAndExt" api route part!',
        });
    }

    const [contributorId, avatarExtension] = idAndExt.split('.');

    if (!contributorId) {
        throw createError({
            statusCode: 400,
            message: 'Missing "contributorId" api route part!',
        });
    }

    if (!avatarExtension) {
        throw createError({
            statusCode: 400,
            message: 'Missing "avatarExtension" api route part!',
        });
    }

    const contributorAvatarPath =
        ERUDIT.config.paths.project +
        `/contributors/${contributorId}/avatar.${avatarExtension}`;

    if (!existsSync(contributorAvatarPath)) {
        throw createError({
            statusCode: 404,
            statusMessage: `Avatar is missing!`,
            message: `Failed to find avatar for "${contributorId}" with "${avatarExtension}" file extension!`,
        });
    }

    return sendStream(event, createReadStream(contributorAvatarPath));
});
