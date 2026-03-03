import { isDevLikeMode } from '@erudit-js/core/mode';
import { subscribeReload } from '../erudit/reloadSignal';

export default defineEventHandler((event) => {
  if (!isDevLikeMode(ERUDIT.mode)) {
    throw createError({ statusCode: 404 });
  }

  const { res, req } = event.node;

  setResponseHeaders(event, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  res.write(': connected\n\n');

  const unsub = subscribeReload(() => {
    res.write('data: reload\n\n');
  });

  req.on('close', unsub);

  // Keep connection open
  return new Promise<void>(() => {});
});
