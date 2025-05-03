import {
    defineElementTranspiler,
    type PlainObject,
} from '@bitran-js/transpiler';
import { getEruditBitranRuntime } from '@erudit-js/cog/schema';

import { getFileFullPath } from '@server/repository/file';

import { CalloutParser, CalloutStringifier } from './factory';
import {
    CalloutNode,
    type CalloutSchema,
    type CalloutIcon,
    calloutRenderDataGenerator,
    type CalloutIconCustom,
} from './shared';
import { serverAbsolutizeContentPath } from '@erudit/server/plugin/repository/contentId';

export class CalloutServerParser extends CalloutParser {
    override parseIcon(obj: PlainObject): CalloutIcon {
        const icon = super.parseIcon(obj);
        const { insideInclude, context } = getEruditBitranRuntime(this);

        if (insideInclude && icon.type === 'custom') {
            icon.src =
                '/' +
                serverAbsolutizeContentPath(icon.src, context.location.path!);
        }

        return icon;
    }
}

export const calloutServerTranspiler = defineElementTranspiler<CalloutSchema>({
    Node: CalloutNode,
    Parsers: [CalloutServerParser],
    Stringifier: CalloutStringifier,
    renderDataGenerator: {
        ...calloutRenderDataGenerator,
        async createValue({ node, extra: runtime }) {
            if (!runtime) {
                throw new Error(
                    `Missing runtime when prerendering filename for Callout element!`,
                );
            }

            const icon = node.parseData.icon as CalloutIconCustom;

            const absoluteContentPath = serverAbsolutizeContentPath(
                icon.src,
                runtime.context.location.path!,
            );

            const filepath = await getFileFullPath(absoluteContentPath);

            if (!filepath) {
                throw new Error(`File not found for content path: ${icon.src}`);
            }

            return filepath;
        },
    },
});
