import { PreviewDataType, type PreviewDataBase } from '../data';
import { PreviewRequestType, type PreviewRequest } from '../request';

export interface PreviewDataGenericLink extends PreviewDataBase {
    type: PreviewDataType.GenericLink;
    external: boolean;
    href: string;
}

export async function buildGenericLink(
    request: PreviewRequest,
): Promise<PreviewDataGenericLink> {
    if (request.type !== PreviewRequestType.Link) return;

    const { linkTarget } = request;

    if (!['external', 'absolute'].includes(linkTarget.type)) return;

    return {
        type: PreviewDataType.GenericLink,
        external: linkTarget.type === 'external',
        href: linkTarget.href,
    };
}
