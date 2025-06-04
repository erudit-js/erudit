import eruditConfig from '#erudit/config';

interface EruditHead {
    title: string;
    description?: string;
}

export function useEruditHead(head: EruditHead) {
    const siteTitle = getSiteTitle();
    const title = head.title ? `${head.title} - ${siteTitle}` : siteTitle;

    useHead({ title });

    useSeoMeta({
        title,
        ogTitle: title,
        description: head.description,
        ogDescription: head.description,
    });
}

function getSiteTitle() {
    return eruditConfig.seo?.title || eruditConfig.site?.title || 'Erudit';
}
