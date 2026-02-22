import {
  isRawElement,
  rawToProse,
  type IdMaker,
  type RawToProseResult,
  type RawToProseStep,
  type Schema,
} from 'tsprose';
import type { EruditLanguageCode } from '@erudit-js/core/eruditConfig/language';

import type { EruditRawElement } from '../rawElement.js';
import { snippetHook, type ResolvedSnippet } from '../snippet.js';
import type {
  RawToProseHook,
  RawToProseHooks,
  RawToProseSchemaHook,
  RawToProseSchemaHooks,
} from './hook.js';
import { tocHook, type ResolvedTocItem } from '../toc.js';
import { createDefaultSlugify, type SlugifyCreator } from '../slugify/index.js';
import { problemScriptHook } from '../elements/problem/hook.js';
import { linkHook, type ContentLinks } from '../elements/link/hook.js';
import { countSchemasHook } from './countSchemas.js';
import { uniqueTitlesHook } from './uniqueTitles.js';

export type EruditRawToProseTask = {
  rawProse: EruditRawElement;
  language?: EruditLanguageCode;
  snippets?: {
    enabled: boolean;
  };
  toc?: {
    enabled: boolean;
    /** Try to add elements with provided schemas. They must have title and not be manually excluded from TOC. */
    addSchemas?: Schema[];
  };
  hooks?: RawToProseHooks;
  schemaHooks?: RawToProseSchemaHooks;
  idMaker?: IdMaker;
  createSlugify?: SlugifyCreator;
};

export interface EruditRawToProseResult extends RawToProseResult {
  toc: ResolvedTocItem[];
  snippets: ResolvedSnippet[];
  files: Set<string>;
  problemScripts: Set<string>;
  contentLinks: ContentLinks;
  schemaCounts: Record<string, number>;
  uniqueTitles: Record<string, string>;
}

export async function eruditRawToProse(
  task: EruditRawToProseTask,
): Promise<EruditRawToProseResult> {
  const { rawProse, hooks, schemaHooks } = task;

  const result: EruditRawToProseResult = {
    prose: undefined as any,
    uniques: {},
    takenIds: new Map(),
    //
    toc: [],
    snippets: [],
    files: new Set(),
    problemScripts: new Set(),
    contentLinks: new Map(),
    schemaCounts: {},
    uniqueTitles: {},
  };

  const _hooks: RawToProseHooks = [
    snippetHook,
    tocHook,
    problemScriptHook,
    linkHook,
    countSchemasHook,
    uniqueTitlesHook,
    ...(hooks || []),
  ];
  const createdHooks: Exclude<Awaited<ReturnType<RawToProseHook>>, void>[] = [];
  for (const hook of _hooks) {
    const createdHook = await hook({ task, result });
    if (createdHook) {
      createdHooks.push(createdHook);
    }
  }

  const createdSchemaHooks: Map<
    Schema,
    Exclude<Awaited<ReturnType<RawToProseSchemaHook>>, void>
  > = new Map();
  for (const [schema, hook] of schemaHooks || []) {
    const createdHook = await hook({ task, result });
    if (createdHook) {
      createdSchemaHooks.set(schema, createdHook);
    }
  }

  const step: RawToProseStep = async (elements) => {
    for (const [schema, schemaHook] of createdSchemaHooks) {
      if (schemaHook.anyStep) {
        await schemaHook.anyStep(elements);
      }

      if (isRawElement(elements.rawElement, schema)) {
        if (schemaHook.matchStep) {
          await schemaHook.matchStep({
            rawElement: elements.rawElement,
            proseElement: elements.proseElement,
          });
        }
      }
    }

    for (const hook of createdHooks) {
      if (hook.step) {
        await hook.step(elements);
      }
    }
  };

  const baseRawToProseResult = await rawToProse({
    rawProse,
    step,
    idMaker: task.idMaker,
    slugify: task.createSlugify
      ? await task.createSlugify(task)
      : await createDefaultSlugify(task),
  });

  result.prose = baseRawToProseResult.prose;
  result.uniques = baseRawToProseResult.uniques;
  result.takenIds = baseRawToProseResult.takenIds;

  for (const schemaHook of createdSchemaHooks.values()) {
    if (schemaHook.finally) {
      await schemaHook.finally();
    }
  }

  for (const hook of createdHooks) {
    if (hook.finally) {
      await hook.finally();
    }
  }

  return result;
}
