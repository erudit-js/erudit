import type { ContentType, TopicPart } from '@erudit-js/cog/schema';

import type { Document } from '../../document';
import { ProseError } from '../../error';
import type { ElementSchema } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';
import { isUnique, type ElementUniqueAny } from '../../unique';
import { isTextElement } from '../text';

export enum LinkType {
    Direct = 'direct',
    Unique = 'unique',
    Document = 'document',
}

export interface LinkDataBase {
    text: string;
}

export interface LinkDataDirect extends LinkDataBase {
    type: LinkType.Direct;
    href: string;
}

export interface LinkDataUnique extends LinkDataBase {
    type: LinkType.Unique;
    targetUniqueId: string;
}

export interface LinkDataDocument extends LinkDataBase {
    type: LinkType.Document;
    targetDocumentUrl: string;
}

export type LinkData = LinkDataDirect | LinkDataUnique | LinkDataDocument;

export type LinkStorageUnique = {
    type: LinkType.Unique;
    href: string;
    elementName: string;
    title: string;
    documentTypeOrPart: ContentType | TopicPart;
    documentTitle: string;
};

export type LinkStorageDocument = {
    type: LinkType.Document;
    href: string;
    typeOrPart: ContentType | TopicPart;
    title: string;
};

export type LinkStorage = LinkStorageUnique | LinkStorageDocument | undefined;

export function createLinkStorageKey(data: LinkData): string | undefined {
    switch (data.type) {
        case LinkType.Direct:
            return undefined;
        case LinkType.Unique:
            return 'link:' + data.type + ':' + data.targetUniqueId;
        case LinkType.Document:
            return 'link:' + data.type + ':' + data.targetDocumentUrl;
    }
}

export const linkName = 'link';

export type LinkSchema = ElementSchema<{
    Type: ElementType.Inliner;
    Name: typeof linkName;
    Linkable: false;
    Data: LinkData;
    Storage: LinkStorage;
    Children: undefined;
}>;

export const Link = defineTag('a')<
    LinkSchema,
    { to: ElementUniqueAny | Document<any> | string; children: string }
>({
    type: ElementType.Inliner,
    name: linkName,
    linkable: false,
    initElement({ tagName, element, children, props: { to } }) {
        if (!children) {
            throw new ProseError(
                `<${tagName}> requires exactly one child element!`,
            );
        }

        if (children.length !== 1) {
            throw new ProseError(
                `<${tagName}> requires exactly one child element, but received ${children.length} children: ${children
                    .map((c) => `<${c.tagName}>`)
                    .join(', ')}!`,
            );
        }

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

        if (typeof to === 'string') {
            data = { type: LinkType.Direct, href: to, text: child.data };
        } else if (isUnique(to)) {
            data = {
                type: LinkType.Unique,
                targetUniqueId: to.id,
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
