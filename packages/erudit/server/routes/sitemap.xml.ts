export default defineEventHandler(async (event) => {
    const urls = new Set<string>();
    urls.add(PAGES.index);

    //
    // Contributors
    //

    if (ERUDIT.config.public.project.contributors?.enabled) {
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

    if (ERUDIT.config.public.project.sponsors?.enabled) {
        urls.add(PAGES.sponsors);
    }

    //
    // Content
    //

    {
        const dbContentItems = await ERUDIT.db.query.content.findMany({
            columns: { fullId: true },
        });

        for (const dbContentItem of dbContentItems) {
            const fullId = dbContentItem.fullId;
            const contentNode = ERUDIT.contentNav.getNodeOrThrow(fullId);

            if (contentNode.type === 'topic') {
                const parts =
                    await ERUDIT.repository.content.topicParts(fullId);
                for (const part of parts) {
                    urls.add(PAGES.topic(part, contentNode.shortId));
                }
            } else {
                urls.add(PAGES[contentNode.type](fullId));
            }

            const elementSnippets =
                await ERUDIT.repository.content.elementSnippets(fullId);

            for (const snippet of elementSnippets || []) {
                if (snippet.seo) {
                    urls.add(snippet.link);
                }
            }
        }
    }

    //
    // Build XML
    //

    setHeader(event, 'Content-Type', 'application/xml');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(urls)
    .map(
        (url) => `    <url>
        <loc>${slasher(ERUDIT.config.public.project.originUrl + ERUDIT.config.public.project.baseUrl + url)}</loc>
    </url>`,
    )
    .join('\n')}
</urlset>`.trim();

    return xml;
});
