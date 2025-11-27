export interface ParsedContentPathPart {
    position: number;
    skip: boolean;
    partId: string;
}

export function parseContentPathPart(
    part: string,
): ParsedContentPathPart | undefined {
    const [_all, position, skipChar, partId] =
        part.match(/^(\d+)([-\+])(.+)$/) || [];

    if (position && skipChar && partId) {
        return {
            position: parseInt(position),
            skip: skipChar === '+',
            partId,
        };
    }
}

export function contentPathToId(
    path: string,
    projectPath: string,
    short: 'full' | 'short',
): string | undefined {
    if (path.startsWith(`${projectPath}/content/`)) {
        const pathAfterContent = path.slice(`${projectPath}/content/`.length);
        const parts = pathAfterContent.split('/');

        const parsedParts: ParsedContentPathPart[] = [];

        for (const part of parts) {
            const parsedPart = parseContentPathPart(part);

            if (parsedPart) {
                parsedParts.push(parsedPart);
            } else {
                // Reached a part that's not a content path part, stop here
                break;
            }
        }

        if (parsedParts.length === 0) {
            return undefined;
        }

        // Build the content ID
        const partsToInclude =
            short === 'short'
                ? parsedParts.filter((part, index) => {
                      // Keep all non-skippable parts, or if it's the last part (even if skippable)
                      return !part.skip || index === parsedParts.length - 1;
                  })
                : parsedParts;

        return partsToInclude.map((part) => part.partId).join('/');
    }
}
