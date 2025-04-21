import { PreviewDataType, type PreviewData } from './data';
import { PreviewRequestType, type PreviewRequest } from './request';
import { PreviewThemeName } from './state';

const builders = [
    async (request: PreviewRequest) =>
        (await import('./data/genericLink')).buildGenericLink(request),
    async (request: PreviewRequest) =>
        (await import('./data/pageLink')).buildPageLink(request),
    async (request: PreviewRequest) =>
        (await import('./data/unique')).buildUnique(request),
];

export async function buildPreviewData(
    request: PreviewRequest,
): Promise<PreviewData> {
    if (request.type === PreviewRequestType.Data) return request.data;

    if (request.type === PreviewRequestType.MissingElement) {
        if (request.hashMismatch) {
            const phrase = await usePhrases(
                'preview_missing_title',
                'preview_missing_explain_mismatch',
                'element_id',
                'current_page_hash',
                'expected_page_hash',
            );

            const { createPreviewError } = await import('./data/alert');

            return createPreviewError({
                title: phrase.preview_missing_title,
                message: phrase.preview_missing_explain_mismatch,
                pre: `${phrase.element_id}: ${request.elementId}\n${phrase.current_page_hash}: ${request.hashMismatch.current}\n${phrase.expected_page_hash}: ${request.hashMismatch.expected}`,
            });
        } else {
            const phrase = await usePhrases(
                'preview_missing_title',
                'preview_missing_explain',
                'element_id',
            );

            const { createPreviewError } = await import('./data/alert');

            return createPreviewError({
                title: phrase.preview_missing_title,
                message: phrase.preview_missing_explain,
                pre: `${phrase.element_id}: ${request.elementId}`,
            });
        }
    }

    if (request.type === PreviewRequestType.HashMismatch) {
        const phrase = await usePhrases(
            'preview_hash_mismatch_title',
            'preview_hash_mismatch_explain',
            'current_page_hash',
            'expected_page_hash',
        );

        return {
            type: PreviewDataType.Alert,
            theme: PreviewThemeName.Warn,
            title: phrase.preview_hash_mismatch_title,
            message: phrase.preview_hash_mismatch_explain,
            pre: `${phrase.current_page_hash}: ${request.currentHash}\n${phrase.expected_page_hash}: ${request.expectedHash}`,
        };
    }

    for (const build of builders) {
        const result = await build(request);
        if (result) return result;
    }

    const { createPreviewError } = await import('./data/alert');
    throw createPreviewError({
        message: `Unable to build preview data for request!`,
        pre: JSON.stringify(request, null, 4),
    });
}
