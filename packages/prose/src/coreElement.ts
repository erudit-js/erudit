import type { ElementStorageCreator, Schema } from 'tsprose';

import type { RawToProseSchemaHook } from './rawToProse/hook.js';
import type { EruditTag, ToEruditTag } from './tag.js';

export interface ProseCoreElementDependencies {
  [dependencyName: string]: {
    transpile?: boolean;
    optimize?: boolean;
  };
}

export type ToProseCoreElement<
  TSchema extends Schema,
  Tags extends EruditTag[] | undefined,
> = {
  schema: TSchema;
  tags: Tags;
  dependencies?: ProseCoreElementDependencies;
} & (
  | { createStorage: ElementStorageCreator<TSchema> }
  | { createStorage?: undefined }
) &
  (
    | { rawToProseHook: RawToProseSchemaHook<TSchema> }
    | { rawToProseHook?: undefined }
  );

export type ProseCoreElement = ToProseCoreElement<
  Schema,
  EruditTag[] | undefined
>;

export type ProseCoreElements = Record<string, ProseCoreElement>;

export function defineProseCoreElement<
  const TSchema extends Schema,
  const CoreElement extends ToProseCoreElement<
    TSchema,
    ToEruditTag<TSchema, string, any>[] | undefined
  >,
>(coreElement: CoreElement & { schema: TSchema }): CoreElement {
  return coreElement;
}

export function defineProseCoreElements<
  const CoreElements extends ProseCoreElement[],
>(...coreElements: CoreElements): CoreElements {
  return coreElements;
}
