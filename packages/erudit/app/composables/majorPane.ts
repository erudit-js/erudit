import type { Component } from 'vue';

import type { MyIconName } from '#my-icons';

import Nav from '@app/components/aside/major/panes/nav/Nav.vue';
import Pages from '@app/components/aside/major/panes/Pages.vue';
import Search from '@app/components/aside/major/panes/Search.vue';
import Language from '@app/components/aside/major/panes/Language.vue';
import Other from '@app/components/aside/major/panes/other/Other.vue';

interface MajorPane {
    icon: MyIconName;
    phrase: EruditPhraseId;
    content: Component;
}

function definePane<TPane extends MajorPane>(pane: TPane) {
    return pane;
}

export const majorPanes = {
    index: definePane({ icon: 'book', phrase: 'index', content: Nav }),
    pages: definePane({ icon: 'file-lines', phrase: 'pages', content: Pages }),
    search: definePane({ icon: 'search', phrase: 'search', content: Search }),
    language: definePane({
        icon: 'globe',
        phrase: 'language',
        content: Language,
    }),
    other: definePane({
        icon: 'ellipsis-vertical',
        phrase: 'other',
        content: Other,
    }),
};

function getPaneOrder(paneKey: MajorPaneKey) {
    return Object.keys(majorPanes).indexOf(paneKey);
}

export type MajorPaneKey = keyof typeof majorPanes;

export function useMajorPane() {
    const route = useRoute();

    const activePane = useState<MajorPaneKey>('major-pane', () => {
        switch (route.path) {
            case '/members':
                return 'pages';
            default:
                return 'index';
        }
    });

    return {
        panes: majorPanes,
        activePane,
        getPaneOrder,
    };
}
