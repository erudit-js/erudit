import { eq } from 'drizzle-orm';

export async function getContentBreadcrumbs(fullId: string) {
    const breadcrumbs: Breadcrumbs = [];

    const navNode = ERUDIT.contentNav.getNodeOrThrow(fullId);
    await ERUDIT.contentNav.walkUp(async (stepNode) => {
        const dbContent = (await ERUDIT.db.query.content.findFirst({
            columns: {
                title: true,
            },
            where: eq(ERUDIT.db.schema.content.fullId, stepNode.fullId),
        }))!;

        breadcrumbs.push({
            icon: ICONS[stepNode.type],
            title: dbContent.title,
            link: await ERUDIT.repository.content.link(stepNode.fullId),
        });
    }, navNode);

    return breadcrumbs.reverse();
}
