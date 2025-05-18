import { parseClientBitranLocation } from '@server/bitran/location';
import { getBitranContent } from '@server/bitran/content';

import { type RawBitranContent } from '@shared/bitran/content';

export default defineEventHandler<Promise<RawBitranContent>>(async (event) => {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    const location = await parseClientBitranLocation(
        event.context.params!.location,
    );

    return await getBitranContent(location);
});
