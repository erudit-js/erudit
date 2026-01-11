import type { ContentNavNode } from '../types';

export enum WalkStop {
    NoDeeper,
    Exit,
}

type WalkStepReturnSync = void | WalkStop;
type WalkStepReturn = WalkStepReturnSync | Promise<WalkStepReturnSync>;

function shouldExit(result: WalkStepReturnSync): boolean {
    return result === WalkStop.Exit;
}

function shouldSkipChildren(result: WalkStepReturnSync): boolean {
    return result === WalkStop.NoDeeper;
}

function getRoots() {
    return ERUDIT.contentNav.id2Root.values();
}

function hasChildren(node: ContentNavNode): boolean {
    return ERUDIT.contentNav.hasChildren(node);
}

export function walkSync(
    step: (node: ContentNavNode) => WalkStepReturnSync,
    from?: ContentNavNode,
) {
    function _walk(node: ContentNavNode): boolean {
        const stepResult = step(node);

        if (shouldExit(stepResult)) {
            return true;
        }

        if (!shouldSkipChildren(stepResult) && hasChildren(node)) {
            for (const child of node.children!) {
                if (_walk(child)) {
                    return true;
                }
            }
        }

        return false;
    }

    if (!from) {
        for (const root of getRoots()) {
            if (_walk(root)) {
                break;
            }
        }
        return;
    }

    _walk(from);
}

export async function walk(
    step: (node: ContentNavNode) => WalkStepReturn,
    from?: ContentNavNode,
) {
    async function _walk(node: ContentNavNode): Promise<boolean> {
        const stepResult = await step(node);

        if (shouldExit(stepResult)) {
            return true;
        }

        if (!shouldSkipChildren(stepResult) && hasChildren(node)) {
            for (const child of node.children!) {
                if (await _walk(child)) {
                    return true;
                }
            }
        }

        return false;
    }

    if (!from) {
        for (const root of getRoots()) {
            if (await _walk(root)) {
                break;
            }
        }
        return;
    }

    await _walk(from);
}

export function walkUpSync(
    step: (node: ContentNavNode) => void | false,
    from: ContentNavNode,
) {
    let cursor: ContentNavNode | undefined = from;

    while (cursor) {
        const result = step(cursor);

        if (result === false) {
            return;
        }

        cursor = cursor.parent;
    }
}

export async function walkUp(
    step: (node: ContentNavNode) => Promise<void | false> | void | false,
    from: ContentNavNode,
) {
    let cursor: ContentNavNode | undefined = from;

    while (cursor) {
        const result = await step(cursor);

        if (result === false) {
            return;
        }

        cursor = cursor.parent;
    }
}
