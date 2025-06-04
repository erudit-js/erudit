import { getCameoIds } from '@server/repository/cameo';
import { getTier2SponsorIds } from '@server/sponsor/repository';

export default defineEventHandler(async () => {
    const cameoIds = await getCameoIds();
    return [
        '/api/cameo/ids',
        '/api/sponsor/cameo/ids',
        ...cameoIds.map((id) => `/api/cameo/data/${id}`),
        ...getTier2SponsorIds().map((id) => `/api/sponsor/cameo/data/${id}`),
    ];
});
