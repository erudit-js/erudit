import { describe, expect, it } from 'vitest';

import {
    isolateProse,
    isRawElement,
    PROSE_REGISTRY,
    textSchema,
} from '@jsprose/core';

import { asEruditRaw } from '@erudit-js/prose';
import {
    Li,
    List,
    listItemRegistryItem,
    listItemSchema,
    listRegistryItem,
} from '@erudit-js/prose/elements/list/core';
import {
    P,
    paragraphRegistryItem,
    paragraphSchema,
} from '@erudit-js/prose/elements/paragraph/core';

describe('List Item', () => {
    it('should correctly create ul list', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(
                listRegistryItem,
                listItemRegistryItem,
                paragraphRegistryItem,
            );

            const ulList = asEruditRaw(
                <List type="ul">
                    <Li>Item 1</Li>
                    <Li>
                        <P>Item 2</P>
                    </Li>
                </List>,
            );

            expect(ulList.data).toStrictEqual({ type: 'ul' });
            expect(ulList.children).toHaveLength(2);

            expect(ulList.children![0].schemaName).toBe(listItemSchema.name);
            expect(ulList.children![1].schemaName).toBe(listItemSchema.name);

            expect(
                isRawElement(ulList.children![0].children![0], paragraphSchema),
            ).toBe(true);
            expect(
                isRawElement(ulList.children![1].children![0], paragraphSchema),
            ).toBe(true);
        });
    });

    it('should correctly create ol list with/without start attribute', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(
                listRegistryItem,
                listItemRegistryItem,
                paragraphRegistryItem,
            );

            expect(
                asEruditRaw(
                    <List type="ol">
                        <Li>Item</Li>
                    </List>,
                ).data,
            ).toStrictEqual({ type: 'ol' });

            expect(
                asEruditRaw(
                    <List type="ol" start={5}>
                        <Li>Item</Li>
                    </List>,
                ).data,
            ).toStrictEqual({ type: 'ol', start: 5 });
        });
    });
});
