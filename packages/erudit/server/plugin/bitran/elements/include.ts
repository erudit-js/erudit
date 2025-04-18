import { BlockNode, type ElementNode } from '@bitran-js/core';
import type { BitranTranspiler } from '@bitran-js/transpiler';

import {
    parseBitranLocation,
    parsePartialBitranLocation,
    setEruditBitranRuntime,
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

/**
 * This operation is heavy as fuck.
 * It consumes a lot of memory and is slow.
 * Use as rarely as possible!
 */
export async function traverseInclude(
    includeNode: IncludeNode,
    context: BitranContext,
    listeners: {
        enter?: TraverseEnterFn;
        step?: TraverseStepFn;
        leave?: TraverseLeaveFn;
    },
) {
    const entryLocation = stringifyBitranLocation(
        parsePartialBitranLocation(includeNode.id, context.location),
    );

    const travelMap: Record<string, string | null> = {
        // Not displayed when error, but needed for checking infinite loops
        [entryLocation]: null,
    };

    try {
        await _traverseStep(
            includeNode,
            entryLocation,
            context.aliases,
            listeners,
            travelMap,
        );
    } catch (message) {
        let finalMessage = `Include Traversal Error!\n\n${message}\n\n`;

        for (const [location, includeTarget] of Object.entries(
            travelMap,
        ).reverse()) {
            if (includeTarget === null) continue;

            finalMessage += `at "${printIncludeTarget(includeTarget)}" in "${location}"\n`;
        }

        throw new Error(finalMessage);
    }
}

async function _traverseStep(
    includeNode: IncludeNode,
    location: string,
    aliases: BitranAliases,
    listeners: {
        enter?: TraverseEnterFn;
        step?: TraverseStepFn;
        leave?: TraverseLeaveFn;
    },
    travelMap: Record<string, string | null>,
) {
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
        throw error;
    }

    if (includeTargetLocation in travelMap)
        throw `Include "${printIncludeTarget(includeNode.parseData.location)}" targets "${includeTargetLocation}" which creates infinite loop!`;

    travelMap[location] = includeNode.parseData.location;

    //
    // Loading Unique this Include is referencing to.
    //

    const dbUnique = await ERUDIT_SERVER.DB.manager.findOne(DbUnique, {
        where: { location: includeTargetLocation },
    });

    if (!dbUnique)
        throw `Include "${printIncludeTarget(includeNode.parseData.location)}" is targeting to non-existing unique "${includeTargetLocation}"!`;

    //
    // Creating Bitran core within loaded unique's location context.
    //

    const context: BitranContext = {
        location: parseBitranLocation(includeTargetLocation),
        aliases: dbUnique.context.aliases,
    };

    const bitranTranspiler = await createBitranTranspiler();

    [bitranTranspiler.parser, bitranTranspiler.stringifier].forEach((item) =>
        setEruditBitranRuntime(item, {
            eruditConfig: ERUDIT_SERVER.CONFIG,
            context: structuredClone(context),
            insideInclude: true,
        }),
    );

    listeners.enter &&
        (await listeners.enter({
            _biCode: dbUnique.content,
            _location: includeTargetLocation,
            _bitranTranspiler: bitranTranspiler,
        }));

    //
    // Parsing unique content and sub-traversing all includes if any.
    //

    let stepErrorMessage: string | undefined;

    await bitranTranspiler.parser.parse(dbUnique.content, {
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
                listeners.step &&
                    (await listeners.step({
                        _location: includeTargetLocation,
                        _node: node,
                        _bitranTranspiler: bitranTranspiler,
                    }));

                return;
            }

            try {
                await _traverseStep(
                    node,
                    includeTargetLocation,
                    context.aliases,
                    listeners,
                    travelMap,
                );
            } catch (message: any) {
                stepErrorMessage = message;
            }
        },
    });

    if (stepErrorMessage) throw stepErrorMessage;

    //
    // Leaving from current Include
    //

    listeners.leave &&
        (await listeners.leave({
            _location: includeTargetLocation,
        }));
}

function printIncludeTarget(target: string) {
    return `<~ ${target}`;
}
