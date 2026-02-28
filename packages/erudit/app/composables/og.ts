import type { ContentSeo } from '@erudit-js/core/content/seo';
import { toSeoSnippet } from '@erudit-js/prose';

export function initOgSiteName() {
  const siteTitle =
    ERUDIT.config.seo?.siteTitle || ERUDIT.config.asideMajor?.siteInfo?.title;

  if (!siteTitle) {
    return;
  }

  useSeoMeta({
    ogSiteName: siteTitle,
  });
}

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
    ERUDIT.config.asideMajor?.siteInfo?.title ||
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
        ERUDIT.config.asideMajor?.siteInfo?.title ||
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

  const route = useRoute();

  function findElementSnippet(elementId: string | undefined) {
    if (!elementId || !seoSnippets) return undefined;
    return seoSnippets.find((candidate) => {
      const url = new URL(candidate.link, 'http://x');
      const sameParam = url.searchParams.get('element') === elementId;
      const sameType =
        candidate.link.split('/')[1] ===
        (args.contentTypePath.type === 'topic'
          ? args.contentTypePath.topicPart
          : args.contentTypePath.type);
      return sameParam && sameType;
    });
  }

  // On a static site the server always serves the canonical-path HTML,
  // so SSR-time element SEO is not possible. Instead we set SEO
  // synchronously (before the first await) so the title/description are
  // applied during the first client render without a visible flash.
  // Google's crawler executes JS and will see the final values.
  if (!import.meta.client || !seoSnippets || seoSnippets.length === 0) {
    return;
  }

  const elementQuery = computed(
    () => route.query.element as string | undefined,
  );

  const stopWatch = watch(
    elementQuery,
    async (elementId) => {
      const snippet = findElementSnippet(elementId);
      if (!snippet) {
        setupSeo(baseSeo);
        return;
      }

      const seoSnippet = toSeoSnippet(snippet)!;
      const quickTitle = (() => seoSnippet.title)();
      const quickDescription = (() => seoSnippet.description)();
      setupSeo({
        title: `${quickTitle} - ${seoSiteTitle}`,
        description: quickDescription || '',
        urlPath: snippet.link,
      });

      const elementPhrase = await getElementPhrase(snippet.schemaName);
      const fullTitle = seoSnippet.title;
      const refinedTitle = seoSnippet.titleInherited
        ? `${fullTitle} [${elementPhrase.element_name}]`
        : fullTitle;
      setupSeo({
        title: `${refinedTitle} - ${seoSiteTitle}`,
        description: quickDescription || '',
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
