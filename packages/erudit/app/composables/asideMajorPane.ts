export enum AsideMajorPane {
    ContentNav = 'content-nav',
    Pages = 'pages',
    Search = 'search',
    Settings = 'settings',
    Languages = 'languages',
}

export const asideMajorPanes = Object.values(AsideMajorPane);

export const useAsideMajorPane = () => {
    return useState<AsideMajorPane>('aside-major-pane', () => {
        const routePath = useRoutePath();
        return getActivePane(routePath.value, undefined);
    });
};

export const useAsideMajorPaneWatcher = () => {
    const routePath = useRoutePath();
    const asideMajorPane = useAsideMajorPane();
    watch(routePath, () => {
        asideMajorPane.value = getActivePane(
            routePath.value,
            asideMajorPane.value,
        );
    });
};

function getActivePane(
    path: string,
    currentPane: AsideMajorPane | undefined,
): AsideMajorPane {
    if (currentPane === AsideMajorPane.Search) {
        // The user might be clicking on search result so keep him in search pane!
        return AsideMajorPane.Search;
    }

    const isContributorsPage = path === PAGES.contributors;
    const isContributorPage = path.startsWith(PAGES.contributor());
    const isSponsorsPage = path === PAGES.sponsors;

    if (isContributorsPage || isContributorPage || isSponsorsPage) {
        return AsideMajorPane.Pages;
    }

    return AsideMajorPane.ContentNav;
}
