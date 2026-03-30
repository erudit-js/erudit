import type { ContentContribution } from '@erudit-js/core/content/contributions';
import type { ContentFlags } from '@erudit-js/core/content/flags';

import type { Breadcrumbs } from '../../shared/types/breadcrumbs';
import type { ContentConnections } from '../../shared/types/contentConnections';
import type { ElementSnippet } from '../../shared/types/elementSnippet';
import type { MainContentChildrenItem } from '../../shared/types/mainContent';

function contentTypeToSchemaType(type: string): string {
  return type === 'book' ? 'Book' : type === 'group' ? 'Course' : 'Article';
}

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
  children?: MainContentChildrenItem[];
  contributions?: ContentContribution[];
  flags?: ContentFlags;
  connections?: ContentConnections;
}) {
  const withSiteUrl = useSiteUrl();

  const siteTitle =
    ERUDIT.config.seo?.siteTitle || ERUDIT.config.asideMajor?.siteInfo?.title;

  const schemaType = contentTypeToSchemaType(args.contentType);

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    ...(schemaType === 'Article'
      ? { headline: formatText(args.title) }
      : { name: formatText(args.title) }),
    url: withSiteUrl(args.urlPath),
    inLanguage: ERUDIT.config.language?.current || 'en',
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

  const keyElementTerms = args.keyElements?.length
    ? args.keyElements.map((el) => ({
        '@type': 'DefinedTerm',
        name: formatText(el.seo?.title || el.key?.title || el.title),
        url: withSiteUrl(el.link),
      }))
    : [];

  if (keyElementTerms.length > 0) {
    data.about = keyElementTerms;
  }

  const hasPart: Record<string, unknown>[] = [];

  if (args.children?.length) {
    for (const child of args.children) {
      const part: Record<string, unknown> = {
        '@type': contentTypeToSchemaType(child.type),
        name: formatText(child.title),
        url: withSiteUrl(child.link),
      };
      if (child.description) {
        part.description = formatText(child.description);
      }
      hasPart.push(part);
    }
  }

  hasPart.push(...keyElementTerms);

  if (hasPart.length > 0) {
    data.hasPart = hasPart;
  }

  if (args.contributions?.length) {
    data.author = args.contributions.map((c) => {
      const person: Record<string, unknown> = {
        '@type': 'Person',
        name: c.name || c.contributorId,
      };
      if (c.avatarUrl) {
        person.image = withSiteUrl(c.avatarUrl);
      }
      return person;
    });
  }

  if (args.flags?.advanced) {
    data.educationalLevel = 'Advanced';
  }

  if (args.connections?.hardDependencies?.length) {
    data.isBasedOn = args.connections.hardDependencies.map((dep) => ({
      '@type': contentTypeToSchemaType(dep.contentType),
      name: formatText(dep.title),
      url: withSiteUrl(dep.link),
    }));
  }

  useJsonLd('jsonld-content', data);
}
