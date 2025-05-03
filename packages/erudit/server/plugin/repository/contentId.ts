import { getNavBookIds, getNavNode } from '@server/nav/utils';
import { toAbsoluteContentPath } from '@shared/bitran/contentId';

export function getFullContentId(mixedContentId: string): string {
    const navNode = getNavNode(mixedContentId);
    return navNode.fullId;
}

export function getShortContentId(mixedContentId: string): string {
    const navNode = getNavNode(mixedContentId);
    return navNode.shortId;
}

export function serverAbsolutizeContentPath(
    relativePath: string,
    contextPath: string,
) {
    const absolutePath = toAbsoluteContentPath(
        relativePath,
        contextPath,
        getNavBookIds('full'),
    );

    return absolutePath;
}

export function resolveClientContentId(
    clientContentId: string,
    contextContentId: string,
    mode: 'full' | 'short',
): string {
    const absoluteContentId = serverAbsolutizeContentPath(
        clientContentId,
        contextContentId,
    );

    return mode === 'full'
        ? getFullContentId(absoluteContentId)
        : getShortContentId(absoluteContentId);
}
