import type { ContributorContribution } from '@erudit-js/core/content/contributions';

export interface AsideMinorStateNews {
    type: 'news';
}

export interface AsideMinorContributions {
    type: 'contributions';
    contributions?: ContributorContribution[];
}

export interface AsideMinorStateArticle {
    type: 'article';
    articleId: string;
}

export type AsideMinorState =
    | AsideMinorStateNews
    | AsideMinorContributions
    | AsideMinorStateArticle;

export const useAsideMinor = () => {
    const asideMinor = useState<AsideMinorState | undefined>('aside-minor');

    return {
        asideMinorState: asideMinor,
        showNews() {
            asideMinor.value = { type: 'news' };
        },
        showContributions(contributions?: ContributorContribution[]) {
            asideMinor.value = {
                type: 'contributions',
                contributions,
            };
        },
    };
};
