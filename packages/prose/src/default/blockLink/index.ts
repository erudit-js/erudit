import { ensureHasOneChild } from '../../children';
import type { Document } from '../../document';
import { ProseError } from '../../error';
import type { ElementSchema } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';
import { isUnique, type ElementUniqueAny } from '../../unique';
import {
    createLinkStorageKey,
    LinkType,
    type LinkData,
    type LinkSchema,
    type LinkStorage,
} from '../link';
import { isTextElement } from '../text';

export const blockLinkName = 'blockLink';

export type BlockLinkSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof blockLinkName;
    Linkable: false;
    Data: LinkData;
    Storage: LinkStorage;
    Children: undefined;
}>;

export const BlockLink = defineTag('BlockLink')<
    BlockLinkSchema,
    { to: ElementUniqueAny | Document<any>; children: string }
>({
    type: ElementType.Block,
    name: blockLinkName,
    linkable: false,
    initElement({ tagName, element, children, props: { to } }) {
        ensureHasOneChild(tagName, children);

        const child = children[0];

        if (!isTextElement(child)) {
            throw new ProseError(
                `<${tagName}> requires exactly one text child element, but received <${children[0].tagName}>!`,
            );
        }

        if (!child.data) {
            throw new ProseError(`<${tagName}> element cannot be empty!`);
        }

        let data: LinkSchema['Data'];

        if (isUnique(to)) {
            data = {
                type: LinkType.Unique,
                targetDocumentUrl: to.url,
                targetUniqueSlug: to.slug,
                text: child.data,
            };
        } else {
            data = {
                type: LinkType.Document,
                targetDocumentUrl: to.url,
                text: child.data,
            };
        }

        element.data = data;
        element.storageKey = createLinkStorageKey(data);
    },
});
