import { parseUrlLocation } from '@server/bitran/location';
import { getBitranContent } from '@server/bitran/content';

export default defineEventHandler(async (event) => {
    setResponseHeader(event, 'Content-Type', 'application/json; charset=utf-8');
    const location = parseUrlLocation(event.context.params!.location || '');
    return await getBitranContent(location);
});
