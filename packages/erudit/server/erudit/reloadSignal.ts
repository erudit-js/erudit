type ReloadCallback = () => void;

const subscribers = new Set<ReloadCallback>();

export function subscribeReload(callback: ReloadCallback): () => void {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

export function triggerReload(): void {
  for (const callback of subscribers) {
    callback();
  }
}
