import eruditConfig from '#erudit/config';
import type { ImageData } from '@erudit/shared/image';

export const defaultOgImage = eruditConfig.seo?.defaultOgImage || {
    src: eruditAsset('og-default.png'),
    width: 300,
    height: 300,
};

export function createOgImageTags(siteUrl: string, data: ImageData | string) {
    const tags = [];
    const isImage = typeof data !== 'string';

    tags.push({
        name: 'og:image',
        content: siteUrl + (isImage ? data.src : data),
    });

    if (isImage) {
        tags.push(
            { name: 'og:image:width', content: data.width },
            { name: 'og:image:height', content: data.height },
        );
    }

    return tags;
}
