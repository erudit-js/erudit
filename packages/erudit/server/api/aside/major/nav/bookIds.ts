import { getNavBookIds } from '@server/nav/utils';

export default defineEventHandler(() => {
    return getNavBookIds('short');
});
