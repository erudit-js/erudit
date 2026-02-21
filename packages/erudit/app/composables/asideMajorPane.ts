import { isTopicPart } from '@erudit-js/core/content/topic';
import { isContentType } from '@erudit-js/core/content/type';

export enum AsideMajorPane {
  GlobalNav = 'global-nav',
  BookNav = 'book-nav',
  Pages = 'pages',
  Search = 'search',
  Settings = 'settings',
  Languages = 'languages',
}

export const asideMajorPanes = Object.values(AsideMajorPane);

export const useAsideMajorPane = () => {
  return useState<AsideMajorPane>('aside-major-pane');
};

export const initAsideMajorPaneWatcher = () => {
  const asideMajorPane = useAsideMajorPane();
  const routePath = useRoutePath();
  const { shortBookId } = useContentId();

  asideMajorPane.value = getActivePane(
    asideMajorPane.value,
    routePath.value,
    shortBookId.value,
  );

  watch([routePath, shortBookId], () => {
    asideMajorPane.value = getActivePane(
      asideMajorPane.value,
      routePath.value,
      shortBookId.value,
    );
  });
};

function getActivePane(
  currentPane: AsideMajorPane,
  path: string,
  bookId: string | undefined,
) {
  if (currentPane === AsideMajorPane.Search) {
    // The user might be clicking on search result so keep him in search pane!
    return AsideMajorPane.Search;
  }

  if (bookId) {
    return AsideMajorPane.BookNav;
  }

  if (path === PAGES.contributors) {
    return AsideMajorPane.Pages;
  }

  if (path.startsWith(PAGES.contributor())) {
    return AsideMajorPane.Pages;
  }

  if (path === PAGES.sponsors) {
    return AsideMajorPane.Pages;
  }

  // Fallback to global nav
  return AsideMajorPane.GlobalNav;
}

//
// Content Nav
//

export let globalContentNav: FrontGlobalContentNav;

export async function initGlobalContentNav() {
  const nuxtApp = useNuxtApp();
  const payloadKey = 'global-content-nav';
  const payloadValue: FrontGlobalContentNav =
    (nuxtApp.static.data[payloadKey] ||=
    nuxtApp.payload.data[payloadKey] ||=
      await fetchJson<FrontGlobalContentNav>(
        '/api/aside/major/frontNav/global',
      ));

  globalContentNav = payloadValue;
}

export function useContentId() {
  const routePath = useRoutePath();

  const shortContentId = computed(() => {
    const path = routePath.value;

    const parts = path.split('/');
    parts.pop(); // Remove trailing slash part
    parts.shift(); // Remove leading slash part

    const type = parts.shift();
    if (isContentType(type) || isTopicPart(type)) {
      return parts.join('/');
    }

    return undefined;
  });

  const shortBookId = computed(() => {
    const shortId = shortContentId.value;

    if (!shortId) {
      return undefined;
    }

    let longestMatch = '';
    for (const bookShortId of globalContentNav.bookShortIds) {
      if (shortId.startsWith(bookShortId)) {
        if (bookShortId.length > longestMatch.length) {
          longestMatch = bookShortId;
        }
      }
    }

    return longestMatch || undefined;
  });

  return {
    shortContentId,
    shortBookId,
  };
}

//
// Pages
//

export const asideMajorPagesKey = 'aside-major-pages';
