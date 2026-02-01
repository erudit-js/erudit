import type { ContentSeo } from '@erudit-js/core/content/seo';

export function initOgImage() {
    const withSiteUrl = useSiteUrl();

    const fallbackOgImage = {
        src: eruditPublic('og.png'),
        width: 500,
        height: 500,
    };

    const ogImage = ERUDIT.config.seo?.image || fallbackOgImage;
    useSeoMeta({
        ogImage: {
            url: withSiteUrl(ogImage.src),
            width: ogImage.width,
            height: ogImage.height,
        },
    });
}

export function useIndexSeo(indexPage: IndexPage) {
    setupSeo({
        title: indexPage.seo?.title || indexPage.title,
        description: indexPage.seo?.description || indexPage.description,
        urlPath: '/',
    });
}

export function useStandartSeo(args: {
    title: string;
    description?: string;
    urlPath: string;
}) {
    const seoSiteTitle =
        ERUDIT.config.seo?.siteTitle ||
        ERUDIT.config.siteInfo.title ||
        'Erudit';

    const fullTitle = args.title + ' - ' + seoSiteTitle;

    setupSeo({
        title: fullTitle,
        description: args.description,
        urlPath: args.urlPath,
    });
}

export async function useContentSeo(args: {
    title: string;
    bookTitle?: string;
    contentTypeSuffix?: string;
    contentTypePath: ContentTypePath;
    description?: string;
    seo?: ContentSeo;
    snippets?: ElementSnippet[];
}) {
    const canUseBookTitle = ERUDIT.config.seo?.useBookSiteTitle;

    const seoSiteTitle =
        canUseBookTitle && args.bookTitle
            ? args.bookTitle
            : ERUDIT.config.seo?.siteTitle ||
              ERUDIT.config.siteInfo.title ||
              'Erudit';

    const fullTitle =
        (args.seo?.title || args.title) +
        (args.contentTypeSuffix ? ' [' + args.contentTypeSuffix + ']' : '') +
        ' - ' +
        seoSiteTitle;

    const canonicalPath =
        args.contentTypePath.type === 'topic'
            ? PAGES.topic(
                  args.contentTypePath.topicPart,
                  args.contentTypePath.contentId,
              )
            : PAGES[args.contentTypePath.type](args.contentTypePath.contentId);

    const baseSeo = {
        title: fullTitle,
        description: args.seo?.description || args.description,
        urlPath: canonicalPath,
    } satisfies Parameters<typeof setupSeo>[0];

    setupSeo(baseSeo);

    //
    // SEO snippets
    //

    const seoSnippets = args.snippets?.filter((snippet) => snippet.seo);

    if (!import.meta.client || !seoSnippets || seoSnippets.length === 0) {
        return;
    }

    const route = useRoute();
    const anchor = computed(() => route.hash.replace('#', ''));

    const stopWatch = watch(
        anchor,
        async (hash) => {
            const snippet = hash
                ? seoSnippets.find((candidate) => {
                      const sameHash = candidate.link.split('#')[1] === hash;
                      const sameType =
                          candidate.link.split('/')[1] ===
                          (args.contentTypePath.type === 'topic'
                              ? args.contentTypePath.topicPart
                              : args.contentTypePath.type);
                      return sameHash && sameType;
                  })
                : undefined;

            if (!snippet) {
                setupSeo(baseSeo);
                return;
            }

            const elementPhrase = await getElementPhrase(snippet.schemaName);

            const title = (() => {
                if (snippet.seo?.title) {
                    return snippet.seo.title;
                } else {
                    return snippet.title;
                }
            })();

            const description = (() => {
                if (snippet.seo?.description) {
                    return snippet.seo.description;
                } else {
                    return snippet.description;
                }
            })();

            setupSeo({
                title: `${title} [${elementPhrase.element_name}] - ${seoSiteTitle}`,
                description: description || '',
                urlPath: snippet.link,
            });
        },
        { immediate: true },
    );

    onScopeDispose(() => stopWatch());
}

function setupSeo(seo: {
    title: string;
    description?: string;
    urlPath: string;
}) {
    const withSiteUrl = useSiteUrl();

    function seoNormalize(text: string): string;
    function seoNormalize(text: undefined): undefined;
    function seoNormalize(text: string | undefined): string | undefined;
    function seoNormalize(text?: string): string | undefined {
        return text?.replace(/\s+/g, ' ').trim();
    }

    const title = seoNormalize(formatText(seo.title));
    const description = seoNormalize(formatText(seo?.description));

    useHead({
        link: [
            {
                key: 'canonical',
                rel: 'canonical',
                href: withSiteUrl(seo.urlPath),
            },
        ],
    });

    useSeoMeta({
        title,
        description,
        ogTitle: title,
        ogDescription: description,
        ogUrl: withSiteUrl(seo.urlPath),
    });
}
