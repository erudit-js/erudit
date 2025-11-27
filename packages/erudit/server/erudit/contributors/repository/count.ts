import * as contributors from '#erudit/contributors';

export function countContributors(): number {
    return Object.values(contributors).length;
}
