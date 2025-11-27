import { describe, it, expectTypeOf } from 'vitest';
import {
    defineSchema,
    type NoTagChildren,
    defineRegistryItem,
} from '@jsprose/core';

import {
    defineEruditTag,
    defineEruditProseCoreElement,
    defineEruditProseCoreElements,
} from '@erudit-js/prose';

describe('defineEruditProseCoreElement(s)', () => {
    const fooSchema = defineSchema({
        name: 'test',
        type: 'block',
        linkable: false,
    })<{ Data: undefined; Storage: undefined; Children: undefined }>();

    const fooTag = defineEruditTag({
        tagName: 'FooTag',
        schema: fooSchema,
    })<NoTagChildren>(() => {});

    const fooRegistryItem = defineRegistryItem({
        schema: fooSchema,
        tags: [fooTag],
    });

    const fooCoreElement = defineEruditProseCoreElement({
        registryItem: fooRegistryItem,
    });

    it('should infer single registry item type', () => {
        expectTypeOf<typeof fooCoreElement>().toEqualTypeOf<{
            registryItem: typeof fooRegistryItem;
        }>();
    });

    it('should infer multiple registry items type', () => {
        const coreElements = defineEruditProseCoreElements(
            fooCoreElement,
            fooCoreElement,
        );

        expectTypeOf<(typeof coreElements)[0]>().toEqualTypeOf<{
            registryItem: typeof fooRegistryItem;
        }>();

        expectTypeOf<(typeof coreElements)[1]>().toEqualTypeOf<{
            registryItem: typeof fooRegistryItem;
        }>();
    });
});
