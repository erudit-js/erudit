import { parseClientBitranLocation } from '@server/bitran/location';
import { getBitranToc } from '@server/bitran/toc';

export default defineEventHandler(async (event) => {
    const location = await parseClientBitranLocation(
        event.context.params!.location,
    );
    return await getBitranToc(location);
});
