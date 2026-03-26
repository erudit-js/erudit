import type { Breadcrumbs } from '../../shared/types/breadcrumbs';
import type { ElementSnippet } from '../../shared/types/elementSnippet';

export function useJsonLd(key: string, data: Record<string, unknown>) {
  useHead({
    script: [
      {
        key,
        type: 'application/ld+json',
        innerHTML: JSON.stringify(data),
      },
    ],
  });
}

export function initWebSiteJsonLd() {
  const siteTitle =
    ERUDIT.config.seo?.siteTitle || ERUDIT.config.asideMajor?.siteInfo?.title;

  if (!siteTitle) {
    return;
  }

  const runtimeConfig = useRuntimeConfig();
  const siteUrl = runtimeConfig.public.siteUrl as string;

  if (!siteUrl) {
    return;
  }

  useJsonLd('jsonld-website', {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteTitle,
    url: siteUrl,
  });
}

export function useContentBreadcrumbsJsonLd(breadcrumbs?: Breadcrumbs) {
  if (!breadcrumbs || breadcrumbs.length === 0) {
    return;
  }

  const withSiteUrl = useSiteUrl();

  useJsonLd('jsonld-breadcrumbs', {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: formatText(item.title),
      item: withSiteUrl(item.link),
    })),
  });
}

export function useContentArticleJsonLd(args: {
  title: string;
  description?: string;
  urlPath: string;
  contentType: string;
  lastmod?: string;
  keyElements?: ElementSnippet[];
  breadcrumbs?: Breadcrumbs;
}) {
  const withSiteUrl = useSiteUrl();

  const siteTitle =
    ERUDIT.config.seo?.siteTitle || ERUDIT.config.asideMajor?.siteInfo?.title;

  const schemaType =
    args.contentType === 'book'
      ? 'Book'
      : args.contentType === 'group'
        ? 'Course'
        : 'Article';

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    ...(schemaType === 'Article'
      ? { headline: formatText(args.title) }
      : { name: formatText(args.title) }),
    url: withSiteUrl(args.urlPath),
  };

  if (args.description) {
    data.description = formatText(args.description);
  }

  if (args.lastmod) {
    data.dateModified = args.lastmod;
  }

  const parentBreadcrumb =
    args.breadcrumbs && args.breadcrumbs.length >= 1
      ? args.breadcrumbs[args.breadcrumbs.length - 1]
      : undefined;

  if (parentBreadcrumb) {
    data.isPartOf = {
      '@type': 'WebPage',
      name: formatText(parentBreadcrumb.title),
      url: withSiteUrl(parentBreadcrumb.link),
    };
  } else if (siteTitle) {
    data.isPartOf = {
      '@type': 'WebSite',
      name: siteTitle,
    };
  }

  if (args.keyElements && args.keyElements.length > 0) {
    data.hasPart = args.keyElements.map((el) => ({
      '@type': 'DefinedTerm',
      name: formatText(el.seo?.title || el.key?.title || el.title),
      url: withSiteUrl(el.link),
    }));
  }

  useJsonLd('jsonld-content', data);
}
