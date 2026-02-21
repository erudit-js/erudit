import {
  injectDocumentId,
  isRawElement,
  type AutoUnique,
  type DocumentUniques,
  type DocumentUniquesTemplate,
  type LinkableTag,
  type RawElement,
  type ToRawElement,
  type ToUnique,
  type Unique,
} from 'tsprose';

import { DEFAULT_SEED, type ProblemSeed, ProblemRandom } from './rng.js';
import {
  validateProblemContent,
  type ProblemContentChild,
} from './problemContent.js';
import { EruditProseError } from '../../error.js';

export type CheckFunction = (args: {
  answer: string | undefined;
  name: string;
  answers: Record<string, string | undefined>;
}) => boolean;

//
// Problem Script Src
//

export function insertProblemScriptId(scriptSrc: string, code: string): string {
  return injectDocumentId(scriptSrc, code, 'defineProblemScript');
}

//
// Problem Script
//

export interface ProblemScriptDefinition {
  uniques?: DocumentUniquesTemplate;
  isGenerator?: boolean;
}

// -- Helper Types --

type ProblemContentFnArgs<TDef extends ProblemScriptDefinition> =
  (TDef['uniques'] extends DocumentUniquesTemplate
    ? { uniques: DocumentUniques<TDef['uniques']> }
    : {}) &
    (TDef['isGenerator'] extends true
      ? { initial: boolean; random: ProblemRandom }
      : {});

type ProblemContentFn<TDef extends ProblemScriptDefinition> = (
  args: ProblemContentFnArgs<TDef>,
) => RawElement | { problemContent: RawElement; check?: CheckFunction };

type ProblemScriptInstanceCreator<TDef extends ProblemScriptDefinition> =
  TDef['uniques'] extends DocumentUniquesTemplate
    ? (
        uniquesMapping:
          | (() => AutoUnique)
          | {
              [K in keyof TDef['uniques']]:
                | ToUnique<TDef['uniques'][K] & LinkableTag>
                | (() => AutoUnique);
            },
      ) => ProblemScriptInstance
    : () => ProblemScriptInstance;

// -- Overloads --

export function defineProblemScript(): (
  contentFn: ProblemContentFn<{}>,
) => ProblemScriptInstanceCreator<{}>;

export function defineProblemScript<const TDef extends ProblemScriptDefinition>(
  definition: TDef,
): (contentFn: ProblemContentFn<TDef>) => ProblemScriptInstanceCreator<TDef>;

export function defineProblemScript<const TDef extends ProblemScriptDefinition>(
  scriptSrc: string,
  definition?: TDef,
): (contentFn: ProblemContentFn<TDef>) => ProblemScriptInstanceCreator<TDef>;

// -- Implementation --

export function defineProblemScript<const TDef extends ProblemScriptDefinition>(
  scriptSrcOrDefinition?: string | TDef,
  maybeDefinition?: TDef,
) {
  let scriptSrc: string;
  let definition: TDef;

  if (typeof scriptSrcOrDefinition === 'string') {
    scriptSrc = scriptSrcOrDefinition;
    definition = (maybeDefinition ?? {}) as TDef;
  } else {
    throw new EruditProseError(
      `Problem script requires script ID to be manually specified or inserted at transform time!`,
    );
  }

  function defineProblemContent(
    problemContentFn: ProblemContentFn<TDef>,
  ): ProblemScriptInstanceCreator<TDef> {
    function createInstance(
      uniquesMapping?: (() => AutoUnique) | Record<string, any>,
    ): ProblemScriptInstance {
      const finalizedUniques: Record<string, Unique> = {};

      if (definition.uniques) {
        if (!uniquesMapping) {
          throw new EruditProseError(
            `Problem script with uniques requires a uniques mapping!`,
          );
        }

        if (typeof uniquesMapping === 'function') {
          for (const key in definition.uniques) {
            finalizedUniques[key] = uniquesMapping() as any;
          }
        } else {
          for (const key in uniquesMapping) {
            const mapping = uniquesMapping[key];
            if (typeof mapping === 'function') {
              finalizedUniques[key] = mapping() as any;
            } else {
              finalizedUniques[key] = mapping;
            }
          }
        }
      }

      return {
        scriptSrc,
        uniques: finalizedUniques,
        isGenerator: definition.isGenerator ?? false,
        generate(seed?: ProblemSeed) {
          const finalizedSeed = seed ?? DEFAULT_SEED;

          const result = problemContentFn({
            uniques: finalizedUniques,
            ...(definition.isGenerator
              ? {
                  initial: finalizedSeed === DEFAULT_SEED,
                  random: new ProblemRandom(finalizedSeed),
                }
              : {}),
          } as any);

          const problemContent = isRawElement(result)
            ? result
            : result.problemContent;

          validateProblemContent(
            '[Problem Script]',
            problemContent.children as any,
          );

          return {
            problemContent:
              problemContent.children as ToRawElement<ProblemContentChild>[],
            check: !isRawElement(result) ? result.check : undefined,
          };
        },
      };
    }

    return createInstance as ProblemScriptInstanceCreator<TDef>;
  }

  return defineProblemContent;
}

export interface ProblemScriptInstance {
  scriptSrc: string;
  uniques: Record<string, Unique>;
  isGenerator: boolean;
  generate: (seed?: ProblemSeed) => {
    problemContent: ToRawElement<ProblemContentChild>[];
    check?: CheckFunction;
  };
}
