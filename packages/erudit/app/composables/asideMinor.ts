interface BaseAsideMinorState {
    type: 'news' | 'article';
}

export interface AsideMinorStateNews extends BaseAsideMinorState {
    type: 'news';
}

export interface AsideMinorStateArticle extends BaseAsideMinorState {
    type: 'article';
    articleId: string;
}

export type AsideMinorState = AsideMinorStateNews | AsideMinorStateArticle;

export const useAsideMinor = () => {
    return useState<AsideMinorState | undefined>('aside-minor');
};

export function useAsideMinorNews() {
    const asideMinor = useAsideMinor();
    asideMinor.value = { type: 'news' };
}
