export async function countSponsors() {
  const dbSponsors = await ERUDIT.db.query.sponsors.findMany();
  return dbSponsors.length;
}
