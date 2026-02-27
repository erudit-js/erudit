import { isDevLikeMode } from '@erudit-js/core/mode';

export default defineNuxtPlugin({
  name: 'erudit-dev-reload',
  setup() {
    const runtimeConfig = useRuntimeConfig().public;
    const mode = runtimeConfig.eruditMode as any;
    if (!isDevLikeMode(mode) || !runtimeConfig.eruditReload) return;

    const es = new EventSource('/_reload');
    es.onmessage = () => window.location.reload();
  },
});
