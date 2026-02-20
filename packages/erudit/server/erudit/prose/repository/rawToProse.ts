import { eruditRawToProse, type EruditRawToProseTask } from '@erudit-js/prose';

export async function serverRawToProse(task: EruditRawToProseTask) {
  return eruditRawToProse({
    ...task,
    language: ERUDIT.config.public.language.current,
  });
}
