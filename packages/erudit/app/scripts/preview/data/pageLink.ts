import { PreviewDataType, type PreviewDataBase } from '../data';
import { PreviewRequestType, type PreviewRequest } from '../request';
import type { PreviewFooter } from '../footer';

export interface PreviewDataPageLink extends PreviewDataBase {
    type: PreviewDataType.PageLink;
    footer: PreviewFooter;
    description?: string;
}

export async function buildPageLink(
    request: PreviewRequest,
): Promise<PreviewDataPageLink> {
    if (request.type !== PreviewRequestType.Link) return;

    const { linkTarget } = request;

    if (linkTarget.type !== 'page') return;

    return await $fetch(`/api/preview/page${linkTarget._href}`, {
        responseType: 'json',
    });
}
