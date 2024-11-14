import type { AsideMinorNews } from '@shared/aside/minor';

export default defineEventHandler(async () => {
    return <AsideMinorNews>{
        type: 'news',
    };
});
