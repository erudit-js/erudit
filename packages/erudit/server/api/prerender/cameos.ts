import { getCameoIds } from '@server/repository/cameo';

export default defineEventHandler(async () => {
    const cameoIds = await getCameoIds();
    return ['/api/cameo/ids', ...cameoIds.map((id) => `/api/cameo/data/${id}`)];
});
