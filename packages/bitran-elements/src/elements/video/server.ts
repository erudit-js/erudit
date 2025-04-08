import {
    defineElementTranspiler,
    type PlainObject,
} from '@bitran-js/transpiler';

import {
    getEruditBitranRuntime,
    type EruditBitranRuntime,
} from '@erudit-js/cog/schema';

import { getFileFullPath } from '@server/repository/file';
import { getNavBookIds } from '@server/nav/utils';

import { toAbsoluteContentId } from '@erudit/shared/bitran/contentId';

import { VideoParser, VideoStringifier } from './factory';
import { VideoNode, type VideoSchema, type VideoParseData } from './shared';

export class VideoServerParser extends VideoParser {
    override async parseDataFromObj(obj: PlainObject): Promise<VideoParseData> {
        const parseData = await super.parseDataFromObj(obj);
        const { insideInclude, context } = getEruditBitranRuntime(this);

        if (insideInclude) {
            parseData.src =
                '/' +
                toAbsoluteContentId(
                    parseData.src,
                    context.location.path!,
                    getNavBookIds(),
                );
        }

        return parseData;
    }
}

export const videoServerTranspiler = defineElementTranspiler<VideoSchema>({
    Node: VideoNode,
    Parsers: [VideoServerParser],
    Stringifier: VideoStringifier,
    async createPreRenderData(node, runtime: EruditBitranRuntime) {
        if (!runtime)
            throw new Error('Missing runtime when prerendering video element!');

        const absoluteSrc = toAbsoluteContentId(
            node.parseData.src,
            runtime.context.location.path!,
            getNavBookIds(),
        );
        const fullPath = await getFileFullPath(absoluteSrc);

        if (!fullPath) throw new Error(`Video file not found: ${absoluteSrc}`);

        return {
            resolvedSrc: fullPath,
        };
    },
});
