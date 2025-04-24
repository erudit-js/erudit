import { BlockNode, type ElementNode } from '@bitran-js/core';
import type { BitranTranspiler } from '@bitran-js/transpiler';
import {
    parseBitranLocation,
    parsePartialBitranLocation,
    stringifyBitranLocation,
    tryReplaceAlias,
    type BitranAliases,
    type BitranContext,
} from '@erudit-js/cog/schema';
import { IncludeNode } from '@erudit-js/bitran-elements/include/shared';
import { AliasesNode } from '@erudit-js/bitran-elements/aliases/shared';

import { createBitranTranspiler } from '@server/bitran/transpiler';
import { ERUDIT_SERVER } from '@server/global';
import { DbUnique } from '@server/db/entities/Unique';
import { getNavBookIds } from '@server/nav/utils';

import { toAbsoluteLocation } from '@shared/bitran/contentId';

export type TraverseEnterFn = (payload: {
    _location: string;
    _bitranTranspiler: BitranTranspiler;
    _biCode: string;
}) => Promise<any>;

export type TraverseStepFn = (payload: {
    _location: string;
    _bitranTranspiler: BitranTranspiler;
    _node: ElementNode;
}) => Promise<any>;

export type TraverseLeaveFn = (payload: { _location: string }) => Promise<any>;

export async function traverseInclude(
    includeNode: IncludeNode,
    context: BitranContext,
    listeners: {
        enter?: TraverseEnterFn;
        step?: TraverseStepFn;
        leave?: TraverseLeaveFn;
    },
): Promise<BlockNode[]> {
    const entryLocation = stringifyBitranLocation(
        parsePartialBitranLocation(includeNode.id, context.location),
    );

    // Always use absolute locations as keys for travelMap to avoid infinite loop bugs
    const absEntryLocation = toAbsoluteLocation(
        entryLocation,
        context.location.path!,
        getNavBookIds(),
    );

    const travelMap: Record<string, string | null> = {
        [absEntryLocation]: null,
    };

    try {
        return await _traverseInclude(
            includeNode,
            absEntryLocation,
            context.aliases,
            listeners,
            travelMap,
        );
    } catch (message) {
        let finalMessage = `Include Traversal Error!\n\n${message instanceof Error ? message.message : message}\n\n`;

        // Print the traversal path in the order of traversal
        for (const location of Object.keys(travelMap)) {
            const includeTarget = travelMap[location];
            if (includeTarget === null) continue;
            finalMessage += `at "${printIncludeTarget(includeTarget)}" in "${location}"\n`;
        }

        throw new Error(finalMessage);
    }
}

async function _traverseInclude(
    includeNode: IncludeNode,
    location: string,
    aliases: BitranAliases,
    listeners: {
        enter?: TraverseEnterFn;
        step?: TraverseStepFn;
        leave?: TraverseLeaveFn;
    },
    travelMap: Record<string, string | null>,
): Promise<BlockNode[]> {
    let includeTargetLocation: string;

    try {
        const parsedLocation = parseBitranLocation(location);

        includeTargetLocation = stringifyBitranLocation(
            parsePartialBitranLocation(
                tryReplaceAlias(includeNode.parseData.location, aliases),
                parsedLocation,
            ),
        );

        includeTargetLocation = toAbsoluteLocation(
            includeTargetLocation,
            parsedLocation.path!,
            getNavBookIds(),
        );
    } catch (error) {
        travelMap[location] = includeNode.parseData.location;
        throw new Error(
            `Failed to resolve include target location "${includeNode.parseData.location}" from "${location}": ${error instanceof Error ? error.message : error}`,
        );
    }

    // Use only absolute locations as keys for infinite loop detection
    if (includeTargetLocation in travelMap)
        throw new Error(
            `Include "${printIncludeTarget(includeNode.parseData.location)}" targets "${includeTargetLocation}" which creates infinite loop!`,
        );

    travelMap[location] = includeNode.parseData.location;

    //
    // Loading Unique this Include is referencing to.
    //

    const dbUnique = await ERUDIT_SERVER.DB.manager.findOne(DbUnique, {
        where: { location: includeTargetLocation },
    });

    if (!dbUnique)
        throw new Error(
            `Include "${printIncludeTarget(includeNode.parseData.location)}" is targeting non-existing unique "${includeTargetLocation}"!`,
        );

    //
    // Creating Bitran core within loaded unique's location context.
    //

    const context: BitranContext = {
        location: parseBitranLocation(includeTargetLocation),
        aliases: dbUnique.context.aliases,
    };

    const bitranTranspiler = await createBitranTranspiler({
        eruditConfig: ERUDIT_SERVER.CONFIG,
        context: structuredClone(context),
        insideInclude: true,
    });

    if (listeners.enter) {
        await listeners.enter({
            _biCode: dbUnique.content,
            _location: includeTargetLocation,
            _bitranTranspiler: bitranTranspiler,
        });
    }

    //
    // Parsing unique content and sub-traversing all includes if any.
    //

    let stepErrorMessage: string | Error | undefined;

    const rootNode = await bitranTranspiler.parser.parse(dbUnique.content, {
        step: async (node) => {
            if (stepErrorMessage) return;

            // Skip Alias nodes to prevent them being injected into calling document context and possibly conflicting with other aliases, includes and links...
            if (node instanceof AliasesNode) return;

            // Replacing block ids with absolute ones to make possible to link to them
            if (node instanceof BlockNode)
                node.meta.id = Object.keys(travelMap)
                    .concat([location])
                    .join('__');

            if (!(node instanceof IncludeNode)) {
                if (listeners.step) {
                    await listeners.step({
                        _location: includeTargetLocation,
                        _node: node,
                        _bitranTranspiler: bitranTranspiler,
                    });
                }
                return;
            }

            try {
                await _traverseInclude(
                    node,
                    includeTargetLocation,
                    context.aliases,
                    listeners,
                    travelMap,
                );
            } catch (err: any) {
                stepErrorMessage =
                    err instanceof Error ? err : new Error(String(err));
            }
        },
    });

    if (stepErrorMessage) throw stepErrorMessage;

    //
    // Leaving from current Include
    //

    if (listeners.leave) {
        await listeners.leave({
            _location: includeTargetLocation,
        });
    }

    return (rootNode.children as BlockNode[]) ?? [];
}

function printIncludeTarget(target: string) {
    return `<~ ${target}`;
}
