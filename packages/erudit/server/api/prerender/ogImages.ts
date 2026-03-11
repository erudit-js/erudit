export default defineEventHandler(async () => {
  const ogImageConfig = ERUDIT.config.public.seo?.ogImage;
  if (ogImageConfig === false || typeof ogImageConfig === 'object') {
    return [];
  }

  const routes: string[] = [];

  // Index page
  routes.push('/og/site/index.png');

  // Contributors page
  if (ERUDIT.config.public.contributors?.enabled) {
    routes.push('/og/site/contributors.png');

    const dbContributors = await ERUDIT.db.query.contributors.findMany({
      columns: { contributorId: true },
    });

    for (const dbContributor of dbContributors) {
      routes.push(`/og/site/contributor/${dbContributor.contributorId}.png`);
    }
  }

  // Sponsors page
  if (ERUDIT.config.public.sponsors?.enabled) {
    routes.push('/og/site/sponsors.png');
  }

  // Content pages
  for (const navNode of ERUDIT.contentNav.id2Node.values()) {
    if (navNode.type === 'topic') {
      const topicParts = await ERUDIT.repository.content.topicParts(
        navNode.fullId,
      );

      for (const part of topicParts) {
        routes.push(`/og/content/${part}/${navNode.shortId}.png`);
      }
    } else {
      routes.push(`/og/content/${navNode.type}/${navNode.shortId}.png`);
    }
  }

  return routes;
});
