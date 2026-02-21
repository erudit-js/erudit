import {
  eruditRawToProse,
  type EruditRawToProseTask,
  type RawToProseSchemaHooks,
} from '@erudit-js/prose';
import { coreElements } from '#erudit/prose/global';

function buildSchemaHooks(): RawToProseSchemaHooks {
  const hooks: RawToProseSchemaHooks = new Map();
  for (const coreElement of Object.values(coreElements)) {
    if (coreElement.rawToProseHook) {
      hooks.set(coreElement.schema, coreElement.rawToProseHook);
    }
  }
  return hooks;
}

export async function serverRawToProse(task: EruditRawToProseTask) {
  const elementSchemaHooks = buildSchemaHooks();

  // Merge caller-provided schemaHooks on top of the element hooks
  const mergedSchemaHooks: RawToProseSchemaHooks = task.schemaHooks
    ? new Map([...elementSchemaHooks, ...task.schemaHooks])
    : elementSchemaHooks;

  return eruditRawToProse({
    ...task,
    language: ERUDIT.config.public.language.current,
    schemaHooks: mergedSchemaHooks,
  });
}
