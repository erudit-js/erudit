import type { ProseElement, Schema } from 'tsprose';

import type { EruditRawElement, ToEruditRawElement } from '../rawElement.js';
import type {
  EruditRawToProseContext,
  EruditRawToProseResult,
} from './index.js';

export type RawToProseHookReturn = void | {
  step?: (elements: {
    rawElement: EruditRawElement;
    proseElement: ProseElement;
  }) => void | Promise<void>;
  finally?: () => void | Promise<void>;
};

export type RawToProseHook = (args: {
  context: EruditRawToProseContext;
  result: EruditRawToProseResult;
}) => RawToProseHookReturn | Promise<RawToProseHookReturn>;

export function defineRawToProseHook(hook: RawToProseHook): RawToProseHook {
  return hook;
}

export type RawToProseSchemaHookReturn<TSchema extends Schema = Schema> =
  | void
  | ((
      | {
          anyStep(elements: {
            rawElement: EruditRawElement;
            proseElement: ProseElement;
          }): void | Promise<void>;
        }
      | {
          anyStep?: undefined;
        }
    ) &
      (
        | {
            matchStep(elements: {
              rawElement: ToEruditRawElement<TSchema>;
              proseElement: ProseElement;
            }): void | Promise<void>;
          }
        | {
            matchStep?: undefined;
          }
      ) & {
        finally?: () => void | Promise<void>;
      });

export type RawToProseSchemaHook<TSchema extends Schema = Schema> = (args: {
  context: EruditRawToProseContext;
  result: EruditRawToProseResult;
}) =>
  | RawToProseSchemaHookReturn<TSchema>
  | Promise<RawToProseSchemaHookReturn<TSchema>>;

export type RawToProseHooks = RawToProseHook[];
export type RawToProseSchemaHooks = Map<Schema, RawToProseSchemaHook>;

export function defineRawToProseSchemaHook<TSchema extends Schema>(
  hook: RawToProseSchemaHook<TSchema>,
): RawToProseSchemaHook<TSchema> {
  return hook;
}
