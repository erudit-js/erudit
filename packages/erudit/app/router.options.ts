import type { RouterOptions } from 'vue-router';

export default {
  scrollBehavior(_to, _from, savedPosition) {
    if (!savedPosition && !_to.query.element) {
      return { top: 0 };
    }
    return savedPosition;
  },
} as RouterOptions;
