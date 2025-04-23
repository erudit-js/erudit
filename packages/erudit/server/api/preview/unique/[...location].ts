import {
    stringifyBitranLocation,
    type BitranContext,
} from '@erudit-js/cog/schema';

import { getLocationContext } from '@server/content/context';
import { ERUDIT_SERVER } from '@server/global';
import { DbUnique } from '@server/db/entities/Unique';
import { getBitranContent } from '@server/bitran/content';
import { parseClientBitranLocation } from '@server/bitran/location';

import type { Context } from '@shared/content/context';
import type { StringBitranContent } from '@erudit/shared/bitran/stringContent';

interface ReturnType {
    context: Context;
    productTitle?: string;
    bitran: {
        productName: string;
        context: BitranContext;
        content: StringBitranContent;
    };
}

export default defineEventHandler<Promise<ReturnType>>(async (event) => {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');

    const location = await parseClientBitranLocation(
        event.context.params!.location,
    );

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
