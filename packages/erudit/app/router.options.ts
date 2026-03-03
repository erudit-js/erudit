import type { RouterOptions } from 'vue-router';

export default {
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    // On a hard reload, _from is START_LOCATION (matched is empty).
    // Return false so the browser's native scroll restoration (history.scrollRestoration = 'auto')
    // can restore the position without Vue Router fighting it with { top: 0 }.
    if (!_from || _from.matched.length === 0) {
      return false;
    }
    if (_to.query.element) {
      return false;
    }
    // Only scroll to top when the page path actually changes,
    // not for query-param-only replacements (e.g. ?q= from search input).
    if (_to.path === _from.path) {
      return false;
    }
    return { top: 0 };
  },
} as RouterOptions;
