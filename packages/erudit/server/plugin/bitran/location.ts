import {
    decodeBitranLocation,
    parseBitranLocation,
} from '@erudit-js/cog/schema';

import { getFullContentId } from '@server/repository/contentId';

export async function parseClientBitranLocation(clientLocation: string) {
    clientLocation = decodeURIComponent(clientLocation);
    clientLocation = decodeBitranLocation(clientLocation);

    if (!clientLocation) {
        throw createError({
            statusCode: 400,
            statusText: 'Empty content location router parameter!',
        });
    }

    try {
        const location = parseBitranLocation(clientLocation);

        if (location.path) {
            location.path = await getFullContentId(location.path);
        }

        return location;
    } catch (_error) {
        let error = `Failed to parse client location "${clientLocation}"!`;

        if (_error) {
            error += '\n\n' + _error;
        }

        throw createError({
            statusCode: 400,
            statusText: error,
        });
    }
}
