import {
    defineElementTranspiler,
    type PlainObject,
} from '@bitran-js/transpiler';
import { getEruditBitranRuntime } from '@erudit-js/cog/schema';

import { getNavBookIds } from '@server/nav/utils';
import { getFileFullPath } from '@server/repository/file';
import { toAbsoluteContentId } from '@erudit/shared/bitran/contentId';

import { CalloutParser, CalloutStringifier } from './factory';
import {
    CalloutNode,
    type CalloutSchema,
    type CalloutIcon,
    calloutRenderDataGenerator,
    type CalloutIconCustom,
} from './shared';

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
    renderDataGenerator: {
        ...calloutRenderDataGenerator,
        async createValue({ node, extra: runtime }) {
            if (!runtime) {
                throw new Error(
                    `Missing runtime when prerendering filename for Callout element!`,
                );
            }

            const icon = node.parseData.icon as CalloutIconCustom;

            const absoluteContentPath = toAbsoluteContentId(
                icon.src,
                runtime.context.location.path!,
                getNavBookIds(),
            );

            const filepath = await getFileFullPath(absoluteContentPath);

            if (!filepath) {
                throw new Error(`File not found for content path: ${icon.src}`);
            }

            return filepath;
        },
    },
});
