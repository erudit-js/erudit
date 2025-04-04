import { isTopicPart, isContentType } from '../content/base';

export const bitranLocationTypes = {
    article: true,
    summary: true,
    practice: true,
    group: true,
    contributor: true,
};

export type BitranLocationType = keyof typeof bitranLocationTypes;

export function isBitranLocationType(type: any): type is BitranLocationType {
    return type in bitranLocationTypes;
}

function typeRequiresPath(type: BitranLocationType) {
    return bitranLocationTypes[type];
}

export interface BitranLocation {
    type: BitranLocationType;
    path?: string;
    unique?: string;
}

export function stringifyBitranLocation(location: BitranLocation): string {
    try {
        if (!isBitranLocationType(location.type))
            throw `Unknown Bitran location type "${location.type}"!`;

        if (!location.path && typeRequiresPath(location.type))
            throw 'Missing Bitran location path!';

        if (location.unique === '')
            throw 'Bitran location unique cannot be empty string!';
    } catch (reason) {
        let message = `${reason}\n\n` + JSON.stringify(location, null, 4);
        throw new Error(message);
    }

    return (
        location.type +
        '|' +
        (location.path || '') +
        (location.unique ? '|' + location.unique : '')
    );
}

export function parseBitranLocation(strLocation: string): BitranLocation {
    const [strType, strPath, strUnique] = strLocation.split('|');

    if (!isBitranLocationType(strType))
        throw new Error(`Unknown Bitran location type "${strType}"!`);

    const location: BitranLocation = { type: strType };

    if (!strPath) {
        if (typeRequiresPath(location.type))
            throw new Error(
                `Missing Bitran location path for type "${strType}"!`,
            );
    } else location.path = strPath;

    if (strUnique === '')
        throw `Bitran location "${strLocation}" unique cannot be empty string!`;
    else if (strUnique) location.unique = strUnique;

    return location;
}

export function parsePartialBitranLocation(
    strLocation: string,
    contextLocation: BitranLocation,
): BitranLocation {
    const parts = strLocation.split('|');

    // Ensure context path is an absolute content ID for content types
    const contextPath = (() => {
        const basePath = contextLocation.path;

        if (!basePath) {
            return undefined;
        }

        const contextType = contextLocation.type;

        if (isContentType(contextType)) {
            return basePath.startsWith('/') ? basePath : '/' + basePath;
        }

        return basePath;
    })();

    // Only unique provided. Restoring type + path
    // function -> article|foo/bar|function
    if (parts.length === 1)
        return {
            type: contextLocation.type,
            path: contextPath,
            unique: parts[0],
        };

    if (parts.length === 2) {
        //
        // If there are two parts, the result depends on location type
        //

        // In topics we can reference topic parts without specifying content path
        // practice|function -> practice|foo/bar|function
        if (isTopicPart(parts[0])) {
            const [type, unique] = parts as [BitranLocationType, string];

            if (!isTopicPart(contextLocation.type))
                throw new Error(
                    `String Bitran location "${strLocation}" referencing topic part "${type}" in non-topic context!`,
                );

            return {
                type,
                path: contextPath,
                unique,
            };
        }
    }

    return parseBitranLocation(strLocation);
}

export const { encodeBitranLocation, decodeBitranLocation } = (() => {
    const encodeSymbols = {
        '|': '┃',
        '/': '╱',
        ':': '﹕',
    };

    const decodeSymbols = Object.entries(encodeSymbols).reduce(
        (map, [key, value]) => ((map[value] = key), map),
        {} as Record<string, string>,
    );

    const replaceSymbols = (text: string, symbols: Record<string, string>) => {
        for (const [find, replace] of Object.entries(symbols))
            text = text.replaceAll(find, replace);

        return text;
    };

    return {
        encodeBitranLocation: (strLocation: string) =>
            replaceSymbols(strLocation, encodeSymbols),

        decodeBitranLocation: (strLocation: string) =>
            replaceSymbols(strLocation, decodeSymbols),
    };
})();

export function locationFromPath(routePath: string) {
    const pathParts = (
        routePath.startsWith('/') ? routePath.substring(1) : routePath
    ).split('/');
    const firstPart = pathParts.shift() as any;
    const locationPath = pathParts.join('/');

    if (!locationPath) return undefined;

    if (isTopicPart(firstPart))
        return {
            type: firstPart,
            path: locationPath,
        };

    switch (firstPart) {
        case 'group':
        case 'contributor':
            return {
                type: firstPart,
                path: locationPath,
            };
    }

    return undefined;
}
