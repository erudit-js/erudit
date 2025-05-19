import { stringifyBitranLocation } from '@erudit-js/cog/schema';

import { getLocationContext } from '@server/content/context';
import { ERUDIT_SERVER } from '@server/global';
import { DbUnique } from '@server/db/entities/Unique';
import { parseClientBitranLocation } from '@server/bitran/location';
import { getBitranContent } from '@server/bitran/content';

import type { Context } from '@shared/content/context';
import type { RawBitranContent } from '@shared/bitran/content';

interface ReturnType {
    context: Context;
    title?: string;
    elementName: string;
    rawBitranContent: RawBitranContent;
}

export default defineEventHandler<Promise<ReturnType>>(async (event) => {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');

    const location = await parseClientBitranLocation(
        event.context.params!.location,
    );

    const context = await getLocationContext(location);

    const dbUnique = await (async () => {
        const dbUnique = ERUDIT_SERVER.DB.manager.findOne(DbUnique, {
            select: ['title', 'productName'],
            where: { location: stringifyBitranLocation(location) },
        });

        if (!dbUnique)
            throw createError(
                `Missing unique "${stringifyBitranLocation(location)}"!`,
            );

        return dbUnique as any as DbUnique;
    })();

    return <ReturnType>{
        context,
        title: dbUnique.title,
        elementName: dbUnique.productName,
        rawBitranContent: await getBitranContent(location),
    };
});
