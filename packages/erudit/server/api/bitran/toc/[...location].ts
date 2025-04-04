import { parseUrlLocation } from '@server/bitran/location';
import { getBitranToc } from '@server/bitran/toc';

export default defineEventHandler(async (event) => {
    const location = parseUrlLocation(event.context.params!.location || '');
    return await getBitranToc(location);
});
