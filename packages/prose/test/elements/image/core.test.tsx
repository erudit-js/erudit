import { describe, expect, it } from 'vitest';
import { isolateProse, isRawElement, PROSE_REGISTRY } from '@jsprose/core';

import { asEruditRaw, resolveEruditRawElement } from '@erudit-js/prose';
import {
    Caption,
    captionRegistryItem,
    captionSchema,
} from '@erudit-js/prose/elements/caption/core';
import {
    Image,
    imageRegistryItem,
    imageSchema,
} from '@erudit-js/prose/elements/image/core';

const prepareRegistry = () =>
    PROSE_REGISTRY.setItems(imageRegistryItem, captionRegistryItem);

describe('Image', () => {
    it('should create image correctly', () => {
        isolateProse(() => {
            prepareRegistry();

            const image = asEruditRaw(
                <Image src="image.png" width="600px" invert="dark">
                    <Caption>Image Caption</Caption>
                </Image>,
            );

            expect(isRawElement(image, imageSchema)).toBe(true);
            expect(image.data).toStrictEqual({
                invert: 'dark',
                src: 'image.png',
                width: '600px',
            });
            expect(image.storageKey).toBe('image.png');
            expect(image.children).toHaveLength(1);
            expect(isRawElement(image.children![0], captionSchema)).toBe(true);

            expect(() => <Image src="image.png" />).not.toThrow();
        });
    });

    it('should throw when wrong children are provided', () => {
        isolateProse(() => {
            prepareRegistry();
            // Not caption child
            expect(() => <Image src="image.png">Only Content</Image>).toThrow();
        });
    });
});

describe('imageSrcStep', () => {
    it('collect image srcs', async () => {
        await isolateProse(async () => {
            PROSE_REGISTRY.setItems(imageRegistryItem);

            const { files } = await resolveEruditRawElement({
                context: {
                    language: 'en',
                    linkable: true,
                },
                rawElement: (
                    <>
                        <Image src="image1.png" />
                        Some text
                        <Image src="image2.jpg" invert="dark" />
                    </>
                ),
            });

            expect(files).toEqual(new Set(['image1.png', 'image2.jpg']));
        });
    });
});
