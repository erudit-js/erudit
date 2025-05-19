import type { AsideMinorNews } from '@shared/aside/minor';

export default defineEventHandler(async () => {
    return {
        type: 'news',
    } satisfies AsideMinorNews;
});
