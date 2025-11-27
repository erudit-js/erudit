import { describe, it, expectTypeOf } from 'vitest';
import { defineSchema, type NoTagChildren } from '@jsprose/core';

import {
    defineEruditTag,
    asEruditRaw,
    type EruditRawElement,
} from '@erudit-js/prose';

describe('asEruditRaw', () => {
    it('should infer original schema and tag name', () => {
        const testSchema = defineSchema({
            name: 'test',
            type: 'block',
            linkable: false,
        })<{ Data: undefined; Storage: undefined; Children: undefined }>();

        const TestTag = defineEruditTag({
            tagName: 'TestTag',
            schema: testSchema,
        })<NoTagChildren>(() => {});

        const eruditRawElement = asEruditRaw(TestTag({}));

        expectTypeOf<typeof eruditRawElement>().toEqualTypeOf<
            EruditRawElement<typeof testSchema, 'TestTag'>
        >();
    });
});
