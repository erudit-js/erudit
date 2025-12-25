import type { GlobalLink } from '@erudit-js/core/prose/link';

export const $LINK = createLink();

(globalThis as any).$LINK = $LINK;

function createLink(path = '') {
    return new Proxy({ __link: path } satisfies GlobalLink, {
        get(_, prop: string) {
            if (prop === '__link') return path;

            const finalPath = path ? `${path}/${prop}` : prop;
            return createLink(tranformGlobalLinkString(finalPath));
        },
    });
}

export function tranformGlobalLinkString(linkString: string) {
    const parts = linkString.split('/').filter((part) => part.length > 0);
    const finalParts: string[] = [];

    for (const part of parts) {
        if (part.startsWith('$')) {
            finalParts.push(part);
        } else {
            finalParts.push(
                part.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
            );
        }
    }

    return finalParts.join('/');
}
