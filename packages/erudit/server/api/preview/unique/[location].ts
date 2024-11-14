import type { BitranContent } from '@bitran-js/renderer-vue';

import { parseUrlLocation } from '@server/bitran/location';
import { getLocationContext } from '@server/content/context';
import { ERUDIT_SERVER } from '@server/global';
import { DbUnique } from '@server/db/entities/Unique';
import { getBitranContent } from '@server/bitran/content';

import type { Context } from '@shared/content/context';
import type { BitranContext } from '@shared/bitran/context';
import { stringifyBitranLocation } from '@shared/bitran/location';

interface ReturnType {
    context: Context;
    productTitle?: string;
    bitran: {
        productName: string;
        context: BitranContext;
        content: BitranContent;
    };
}

export default defineEventHandler<Promise<ReturnType>>(async (event) => {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');

    const location = parseUrlLocation(getRouterParam(event, 'location') || '');

    const context = await getLocationContext(location);

    const dbUnique = await (async () => {
        const dbUnique = ERUDIT_SERVER.DB.manager.findOne(DbUnique, {
            select: ['productName', 'title', 'context'],
            where: { location: stringifyBitranLocation(location) },
        });

        if (!dbUnique)
            throw createError(
                `Missing unique "${stringifyBitranLocation(location)}"!`,
            );

        return dbUnique as any as DbUnique;
    })();

    const bitran = await (async () => {
        return {
            content: await getBitranContent(location),
            context: dbUnique.context,
            productName: dbUnique.productName,
        };
    })();

    return <ReturnType>{
        context,
        productTitle: dbUnique.title,
        bitran,
    };
});
