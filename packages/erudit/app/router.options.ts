import type { RouterOptions } from 'vue-router';

export default {
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (_to.query.element) {
      return false;
    }
    // Only scroll to top when the page path actually changes,
    // not for query-param-only replacements (e.g. ?q= from search input).
    if (_from && _to.path === _from.path) {
      return false;
    }
    return { top: 0 };
  },
} as RouterOptions;
