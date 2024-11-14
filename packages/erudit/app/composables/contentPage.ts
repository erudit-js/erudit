import eruditConfig from '#erudit/config';

import { createOgImageTags, defaultOgImage } from '@app/scripts/og';
import type { ContentData } from '@shared/content/data';

export function useContentPage(contentData: Ref<ContentData>) {
    const contentRoute = useContentRoute();
    const siteUrl = useSiteUrl();
    const favicon = useFavicon();

    const phrasePromise = usePhrases(
        'article',
        'summary',
        'practice',
        'site_info_title',
        'seo_article_description',
        'seo_summary_description',
        'seo_practice_description',
    );

    //
    // Favicon
    //

    const contentFavicon = () => {
        setTimeout(() => {
            const newFavicon = (() => {
                switch (contentRoute.value?.type) {
                    case 'topic':
                        const topicPart = contentRoute.value.topicPart;
                        return (
                            eruditConfig.site?.favicon?.[topicPart] ||
                            eruditAsset(`favicon/${topicPart}.svg`)
                        );
                }

                return defaultFavicon;
            })();

            favicon.value = newFavicon;
        }, 500);
    };

    //
    // SEO
    //

    let seoTitlePromise: Promise<void>, seoDescriptionPromise: Promise<void>;

    const seo = {
        title: ref<string>(),
        description: ref<string>(),
    };

    const setupSeoTitle = () => {
        seoTitlePromise = (async () => {
            const phrase = await phrasePromise;

            let title: string = '';
            title +=
                contentData.value.generic?.seo?.title ||
                contentData.value.generic.title ||
                contentData.value.generic.contentId.split('/').pop();

            if (contentData.value.type !== 'book') {
                const bookTitle = contentData.value?.bookTitle;
                title += bookTitle ? ` | ${bookTitle}` : '';
            }

            if (contentRoute.value!.type === 'topic') {
                const topicPart = contentRoute.value!.topicPart;

                if (topicPart !== 'article') title += ` | ${phrase[topicPart]}`;
            }

            title +=
                ' - ' + eruditConfig.seo?.title ||
                eruditConfig.site?.title ||
                phrase.site_info_title;

            seo.title.value = title;
        })();
    };

    const setupSeoDescription = () => {
        seoDescriptionPromise = (async () => {
            const phrase = await phrasePromise;
            const customDescription =
                contentData.value.generic?.seo?.description ||
                contentData.value.generic?.description;

            if (customDescription) {
                seo.description.value = customDescription;
                return;
            }

            if (contentRoute.value!.type === 'topic') {
                const phraseFunc =
                    phrase[`seo_${contentRoute.value!.topicPart}_description`];
                seo.description.value = phraseFunc(
                    contentData.value.generic?.seo?.title ||
                        contentData.value.generic.title!,
                );
                return;
            }

            seo.description.value = '';
        })();
    };

    useSeoMeta({
        // @ts-ignore
        title: seo.title,
        ogTitle: seo.title,
        description: seo.description,
        ogDescription: seo.description,
    });

    const meta = computed(() => {
        return [
            ...createOgImageTags(siteUrl, defaultOgImage),
            ...(contentData.value.generic?.ogImage
                ? createOgImageTags(siteUrl, contentData.value.generic?.ogImage)
                : []),
        ];
    });

    useHead({
        meta,
    });

    //
    //
    //

    watchEffect(() => {
        setupSeoTitle();
        setupSeoDescription();
    });

    onMounted(() => {
        watchEffect(() => {
            contentFavicon();
        });
    });

    onBeforeUnmount(() => {
        favicon.value = defaultFavicon;
    });

    //
    //
    //

    return Promise.all([seoTitlePromise!, seoDescriptionPromise!]);
}
