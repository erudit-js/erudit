export async function countSponsors() {
    const dbSponsors = await ERUDIT.db.query.sponsors.findMany({
        columns: { tier: true },
    });

    let tier1Count = 0;
    let tier2Count = 0;

    dbSponsors.forEach((dbSponsor) =>
        dbSponsor.tier === 1 ? tier1Count++ : tier2Count++,
    );

    return {
        tier1: tier1Count,
        tier2: tier2Count,
        all: tier1Count + tier2Count,
    };
}
