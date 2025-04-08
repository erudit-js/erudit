import {
    defineElementTranspiler,
    type PlainObject,
} from '@bitran-js/transpiler';
import {
    getEruditBitranRuntime,
    type EruditBitranRuntime,
} from '@erudit-js/cog/schema';

import { getNavBookIds } from '@server/nav/utils';
import { getFileFullPath } from '@server/repository/file';

import { toAbsoluteContentId } from '@erudit/shared/bitran/contentId';

import { CalloutParser, CalloutStringifier } from './factory';
import { CalloutNode, type CalloutSchema, type CalloutIcon } from './shared';

export class CalloutServerParser extends CalloutParser {
    override parseIcon(obj: PlainObject): CalloutIcon {
        const icon = super.parseIcon(obj);
        const { insideInclude, context } = getEruditBitranRuntime(this);

        if (insideInclude && icon.type === 'custom') {
            icon.src =
                '/' +
                toAbsoluteContentId(
                    icon.src,
                    context.location.path!,
                    getNavBookIds(),
                );
        }

        return icon;
    }
}

export const calloutServerTranspiler = defineElementTranspiler<CalloutSchema>({
    Node: CalloutNode,
    Parsers: [CalloutServerParser],
    Stringifier: CalloutStringifier,
    async createPreRenderData(node, runtime: EruditBitranRuntime) {
        if (!runtime)
            throw new Error(
                'Missing runtime when prerendering callout element!',
            );

        const icon = node.parseData.icon;

        if (icon.type === 'custom') {
            const src = toAbsoluteContentId(
                icon.src,
                runtime.context.location.path!,
                getNavBookIds(),
            );

            const fullPath = await getFileFullPath(src);

            if (!fullPath)
                throw new Error(`Callot icon file not found: ${src}`);

            return fullPath;
        }

        return 'bobik';
    },
});
