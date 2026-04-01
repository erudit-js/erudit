import { isTopicPart, type TopicPart } from '@erudit-js/core/content/topic';
import { isContentType, type ContentType } from '@erudit-js/core/content/type';

const FALLBACK_FAVICON_EXT = '.svg';

const mimeByExt: Record<string, string> = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
};

function extFromConfigHref(key: string): string {
  const href =
    (ERUDIT.config.favicon as Record<string, string> | undefined)?.[key] ||
    ERUDIT.config.favicon?.default;
  if (!href) return FALLBACK_FAVICON_EXT;
  const path = href.split(/[?#]/)[0] ?? '';
  const dot = path.lastIndexOf('.');
  return dot === -1 ? '' : path.slice(dot).toLowerCase();
}

function mimeFromConfigHref(key: string): string | undefined {
  return mimeByExt[extFromConfigHref(key)];
}

export const useFaviconKey = () =>
  useState<string>('favicon-key', () => 'default');

export function useFavicon() {
  const faviconKey = useFaviconKey();

  function showDefaultFavicon() {
    faviconKey.value = 'default';
  }

  function showContentFavicon(
    args:
      | { type: Exclude<ContentType, 'topic'> }
      | { type: 'topic'; part: TopicPart },
  ) {
    if (args.type === 'topic') {
      if (ERUDIT.config.favicon?.[args.part]) {
        faviconKey.value = args.part;
        return;
      }
    } else {
      if (ERUDIT.config.favicon?.[args.type]) {
        faviconKey.value = args.type;
        return;
      }
    }

    showDefaultFavicon();
  }

  return {
    showDefaultFavicon,
    showContentFavicon,
  };
}

export function initFavicon() {
  const withBaseUrl = useBaseUrl();
  const faviconKey = useFaviconKey();
  const { showDefaultFavicon, showContentFavicon } = useFavicon();
  showDefaultFavicon();

  useHead({
    link: [
      computed(() => {
        const key = faviconKey.value;
        const ext = extFromConfigHref(key);
        const mime = mimeFromConfigHref(key);
        return {
          key: 'favicon',
          rel: 'icon',
          href: withBaseUrl(`/favicon/${key}/source${ext}`),
          ...(mime && { type: mime }),
        };
      }),
      computed(() => ({
        key: 'favicon-png-48',
        rel: 'icon',
        type: 'image/png',
        sizes: '48x48',
        href: withBaseUrl(`/favicon/${faviconKey.value}/48.png`),
      })),
      computed(() => ({
        key: 'favicon-png-32',
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: withBaseUrl(`/favicon/${faviconKey.value}/32.png`),
      })),
      computed(() => ({
        key: 'apple-touch-icon',
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: withBaseUrl(`/favicon/${faviconKey.value}/180.png`),
      })),
    ],
  });

  const route = useRoute();
  const contentFaviconDelay = 5000;
  let contentFaviconChangeTimeout: ReturnType<typeof setTimeout>;
  let stopWatchingRoute: ReturnType<typeof watch> | undefined;
  onMounted(() => {
    stopWatchingRoute = watch(
      () => route.path,
      () => {
        clearTimeout(contentFaviconChangeTimeout);

        const firstPathPart = route.path.split('/')[1];

        if (isTopicPart(firstPathPart)) {
          contentFaviconChangeTimeout = setTimeout(() => {
            showContentFavicon({
              type: 'topic',
              part: firstPathPart,
            });
          }, contentFaviconDelay);
          return;
        }

        if (isContentType(firstPathPart)) {
          contentFaviconChangeTimeout = setTimeout(() => {
            showContentFavicon({
              type: firstPathPart as Exclude<ContentType, 'topic'>,
            });
          }, contentFaviconDelay);
          return;
        }

        showDefaultFavicon();
      },
      { immediate: true },
    );
  });

  onBeforeUnmount(() => {
    clearTimeout(contentFaviconChangeTimeout);
    stopWatchingRoute?.();
  });
}
