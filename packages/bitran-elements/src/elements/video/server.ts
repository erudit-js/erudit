import {
    defineElementTranspiler,
    type PlainObject,
} from '@bitran-js/transpiler';
import { getEruditBitranRuntime } from '@erudit-js/cog/schema';

import { serverAbsolutizeContentPath } from '@server/repository/contentId';
import { getFileFullPath } from '@server/repository/file';

import { VideoParser, VideoStringifier } from './factory';
import {
    VideoNode,
    type VideoSchema,
    type VideoParseData,
    videoRenderDataGenerator,
} from './shared';

export class VideoServerParser extends VideoParser {
    override async parseDataFromObj(obj: PlainObject): Promise<VideoParseData> {
        const parseData = await super.parseDataFromObj(obj);
        const { insideInclude, context } = getEruditBitranRuntime(this);

        if (insideInclude) {
            parseData.src =
                '/' +
                serverAbsolutizeContentPath(
                    parseData.src,
                    context.location.path!,
                );
        }

        return parseData;
    }
}

export const videoServerTranspiler = defineElementTranspiler<VideoSchema>({
    Node: VideoNode,
    Parsers: [VideoServerParser],
    Stringifier: VideoStringifier,
    renderDataGenerator: {
        ...videoRenderDataGenerator,
        async createValue({ node, extra: runtime }) {
            if (!runtime) {
                throw new Error(
                    'Missing runtime when prerendering video element!',
                );
            }

            const absoluteSrc = serverAbsolutizeContentPath(
                node.parseData.src,
                runtime.context.location.path!,
            );

            const fullPath = await getFileFullPath(absoluteSrc);

            if (!fullPath) {
                throw new Error(`Video file not found: ${absoluteSrc}`);
            }

            return {
                resolvedSrc: fullPath,
            };
        },
    },
});
