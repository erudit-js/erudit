export default defineEventHandler(async () => {
  const routes: string[] = [];

  //
  // Index
  //

  routes.push(PAGES.index);

  //
  // Contributors
  //

  if (ERUDIT.config.public.contributors?.enabled) {
    routes.push(PAGES.contributors);

    const dbContributors = await ERUDIT.db.query.contributors.findMany({
      columns: { contributorId: true },
    });

    for (const dbContributor of dbContributors) {
      routes.push(PAGES.contributor(dbContributor.contributorId));
    }
  }

  //
  // Sponsors
  //

  if (ERUDIT.config.public.sponsors?.enabled) {
    routes.push(PAGES.sponsors);
  }

  return routes;
});
