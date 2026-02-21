import { defineRawToProseHook } from './hook.js';

export const uniqueTitlesHook = defineRawToProseHook(({ result }) => {
  return {
    step({ rawElement }) {
      if (rawElement.uniqueName) {
        const title = rawElement.title || rawElement.snippet?.title;
        if (title) {
          result.uniqueTitles[rawElement.uniqueName] = title;
        }
      }
    },
  };
});
