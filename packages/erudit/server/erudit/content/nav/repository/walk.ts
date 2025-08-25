import { ContentNavNode } from '../types';

export enum WalkStop {
    NoDeeper,
    Exit,
}

type WalkStepReturn = void | WalkStop | Promise<void | WalkStop>;

export async function walk(
    step: (node: ContentNavNode) => WalkStepReturn,
    from?: ContentNavNode,
) {
    async function _walk(node: ContentNavNode): Promise<boolean> {
        const stepResult = await step(node);

        if (stepResult === WalkStop.Exit) {
            return true;
        }

        const skipChildren = stepResult === WalkStop.NoDeeper;

        if (!skipChildren && ERUDIT.contentNav.hasChildren(node)) {
            for (const child of node.children!) {
                if (await _walk(child)) {
                    return true;
                }
            }
        }

        return false;
    }

    if (!from) {
        for (const root of ERUDIT.contentNav.rootNodes) {
            if (await _walk(root)) {
                break;
            }
        }
        return;
    }

    await _walk(from);
}
