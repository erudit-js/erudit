import { InlinersNode, type Node } from '@bitran-js/core';
import type {
    ParseFactory,
    Parser,
    RawObject,
    Stringifier,
} from '@bitran-js/transpiler';

export interface Caption {
    main: InlinersNode;
    secondary?: InlinersNode;
    maxWidth?: string;
}

export function validateRawCaption(rawCaption: RawObject): void {
    if (!rawCaption.main) {
        throw new Error('Caption must have a "main" property!');
    }

    if (rawCaption.secondary && typeof rawCaption.secondary !== 'string') {
        throw new Error('Caption "secondary" property must be a string!');
    }
}

export async function parseRawCaption(
    rawCaption: RawObject,
    parent: Node,
    factory: ParseFactory,
): Promise<Caption> {
    const mainInliners = new InlinersNode(parent);
    mainInliners.setNodes(await factory.parseInliners(rawCaption.main));

    const secondaryInliners = rawCaption.secondary
        ? new InlinersNode(parent)
        : undefined;

    if (secondaryInliners) {
        secondaryInliners.setNodes(
            await factory.parseInliners(rawCaption.secondary),
        );
    }

    return {
        main: mainInliners,
        secondary: secondaryInliners,
        maxWidth: rawCaption.maxWidth,
    };
}

export async function toRawCaption(caption: Caption, stringifier: Stringifier) {
    return {
        ...(caption.maxWidth ? { maxWidth: caption.maxWidth } : {}),
        main: await stringifier.stringify(caption.main),
        ...(caption.secondary
            ? { secondary: await stringifier.stringify(caption.secondary) }
            : {}),
    };
}
