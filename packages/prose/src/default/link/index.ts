import type { Document } from '../../document';
import { ProseError } from '../../error';
import type { ElementSchema } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';
import { isUnique, type ElementUniqueAny } from '../../unique';
import { isTextElement } from '../text';

export enum LinkType {
    Unknown = 'unknown',
    Unique = 'unique',
    Document = 'document',
}

export const linkName = 'link';

export type LinkSchema = ElementSchema<{
    Type: ElementType.Inliner;
    Name: typeof linkName;
    Linkable: false;
    Data:
        | { type: LinkType.Unknown; href: string }
        | { type: LinkType.Unique; targetUniqueId: string }
        | { type: LinkType.Document; targetDocumentUrl: string };
    Storage: { resolvedHref: string };
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
            data = { type: LinkType.Unknown, href: to };
        } else if (isUnique(to)) {
            data = { type: LinkType.Unique, targetUniqueId: to.id };
        } else {
            data = {
                type: LinkType.Document,
                targetDocumentUrl: to.url,
            };
        }

        element.data = data;
    },
});
