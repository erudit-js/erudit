import {
    decodeBitranLocation,
    parseBitranLocation,
} from '@erudit/shared/bitran/location';

export function parseUrlLocation(urlLocation: string) {
    urlLocation = decodeURIComponent(urlLocation);
    urlLocation = decodeBitranLocation(urlLocation);

    if (!urlLocation)
        throw createError({
            statusCode: 500,
            statusText: 'Empty content location router parameter!',
        });

    try {
        return parseBitranLocation(urlLocation);
    } catch (error: any) {
        throw createError({
            statusCode: 404,
            statusText:
                error?.message || `Can't parse location "${urlLocation}"!`,
        });
    }
}
