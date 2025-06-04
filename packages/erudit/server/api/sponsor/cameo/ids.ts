import { getTier2SponsorIds } from '@server/sponsor/repository';

export default defineEventHandler(async () => {
    return getTier2SponsorIds();
});
