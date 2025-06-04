import { getCameoIds } from '@server/repository/cameo';

export default defineEventHandler(async () => {
    return await getCameoIds();
});
