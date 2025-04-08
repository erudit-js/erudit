import { InlinersNode, type Node } from '@bitran-js/core';
import type {
    ParseFactory,
    PlainObject,
    Stringifier,
} from '@bitran-js/transpiler';

export interface Caption {
    main: InlinersNode;
    secondary?: InlinersNode;
    maxWidth?: string;
}

export function validateRawCaption(rawCaption: PlainObject | string): void {
    if (typeof rawCaption === 'string') {
        return;
    }

    if (!rawCaption.main) {
        throw new Error('Caption must have a "main" property!');
    }

    if (rawCaption.secondary && typeof rawCaption.secondary !== 'string') {
        throw new Error('Caption "secondary" property must be a string!');
    }
}

export async function parseRawCaption(
    rawCaption: PlainObject | string,
    parent: Node,
    factory: ParseFactory,
): Promise<Caption> {
    const captionObj =
        typeof rawCaption === 'string' ? { main: rawCaption } : rawCaption;

    const mainInliners = new InlinersNode(parent);
    mainInliners.setNodes(await factory.parseInliners(captionObj.main));

    const secondaryInliners = captionObj.secondary
        ? new InlinersNode(parent)
        : undefined;

    if (secondaryInliners) {
        secondaryInliners.setNodes(
            await factory.parseInliners(captionObj.secondary),
        );
    }

    return {
        main: mainInliners,
        secondary: secondaryInliners,
        maxWidth: captionObj.maxWidth,
    };
}

export async function toRawCaptionObj(
    caption: Caption,
    stringifier: Stringifier,
) {
    const onlyMain = !caption.secondary && !caption.maxWidth;

    if (onlyMain) {
        return {
            caption: await stringifier.stringify(caption.main),
        };
    }

    return {
        caption: {
            ...(caption.maxWidth ? { maxWidth: caption.maxWidth } : {}),
            main: await stringifier.stringify(caption.main),
            ...(caption.secondary
                ? { secondary: await stringifier.stringify(caption.secondary) }
                : {}),
        },
    };
}

export function getCaptionChildren(
    caption?: Caption,
): InlinersNode[] | undefined {
    if (!caption) {
        return undefined;
    }

    const children = [caption.main];

    if (caption.secondary) {
        children.push(caption.secondary);
    }

    return children;
}
