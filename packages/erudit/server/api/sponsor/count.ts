import { getSponsorCount } from '@server/sponsor/repository';

export default defineEventHandler(async () => {
    return getSponsorCount();
});
