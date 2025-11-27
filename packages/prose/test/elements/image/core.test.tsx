import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
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
import { getImageSize } from '@erudit-js/prose/elements/image/storage';

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

describe('getImageSize', () => {
    const currentDir = dirname(fileURLToPath(import.meta.url));

    it('should retrieve image size correctly', async () => {
        const size = await getImageSize(currentDir + '/image.jpg');
        expect(size).toStrictEqual({ width: 736, height: 866 });
    });

    it('should throw error for non-image file', async () => {
        expect(async () => {
            await getImageSize(currentDir + '/notAnImage.txt');
        }).rejects.toThrow();
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
