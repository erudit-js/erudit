import { sn } from 'unslash';

export default defineEventHandler(async (event) => {
  const urls = new Set<string>();
  const urlLastmod = new Map<string, string>();

  function addUrl(url: string, lastmod?: string) {
    urls.add(url);
    if (lastmod) urlLastmod.set(url, lastmod);
  }

  addUrl(PAGES.index);

  //
  // Contributors
  //

  if (ERUDIT.config.public.contributors?.enabled) {
    urls.add(PAGES.contributors);

    const dbContributors = await ERUDIT.db.query.contributors.findMany({
      columns: { contributorId: true },
    });

    for (const dbContributor of dbContributors) {
      urls.add(PAGES.contributor(dbContributor.contributorId));
    }
  }

  //
  // Sponsors
  //

  if (ERUDIT.config.public.sponsors?.enabled) {
    urls.add(PAGES.sponsors);
  }

  //
  // Content
  //

  {
    const dbContentItems = await ERUDIT.db.query.content.findMany({
      columns: { fullId: true, lastmod: true },
    });

    for (const dbContentItem of dbContentItems) {
      const fullId = dbContentItem.fullId;
      const hidden = await ERUDIT.repository.content.hidden(fullId);
      if (hidden) {
        continue;
      }

      const contentNode = ERUDIT.contentNav.getNodeOrThrow(fullId);
      const lastmod = dbContentItem.lastmod ?? undefined;

      if (contentNode.type === 'topic') {
        const parts = await ERUDIT.repository.content.topicParts(fullId);
        for (const part of parts) {
          addUrl(PAGES.topic(part, contentNode.shortId), lastmod);
        }
      } else {
        addUrl(PAGES[contentNode.type](fullId), lastmod);
      }

      const elementSnippets =
        await ERUDIT.repository.content.elementSnippets(fullId);

      for (const snippet of elementSnippets || []) {
        if (snippet.seo) {
          addUrl(snippet.link, lastmod);
        }
      }
    }
  }

  //
  // Build XML
  //

  const runtimeConfig = useRuntimeConfig();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(urls)
  .map((url) => {
    const lastmod = urlLastmod.get(url);
    return `    <url>
        <loc>${sn(runtimeConfig.public.siteUrl, url)}</loc>${lastmod ? `\n        <lastmod>${lastmod}</lastmod>` : ''}
    </url>`;
  })
  .join('\n')}
</urlset>`.trim();

  setHeader(event, 'Content-Type', 'application/xml');
  return xml;
});
