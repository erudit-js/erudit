import { defineElementTranspiler, type RawObject } from '@bitran-js/transpiler';
import {
    getEruditBitranRuntime,
    type EruditBitranRuntime,
} from '@erudit-js/cog/schema';
import { imageSizeFromFile } from 'image-size/fromFile';

import { getNavBookIds } from '@erudit/server/plugin/nav/utils';
import { getFileFullPath } from '@server/repository/file';

import { toAbsoluteContentId } from '@erudit/shared/bitran/contentId';

import { PROJECT_DIR } from '#erudit/globalPaths';

import { ImageParser, ImageStringifier } from './factory';
import { ImageNode, type ImageParseData, type ImageSchema } from './shared';

export class ImageServerParser extends ImageParser {
    override async parseDataFromObj(obj: RawObject): Promise<ImageParseData> {
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

export const imageServerTranspiler = defineElementTranspiler<ImageSchema>({
    Node: ImageNode,
    Parsers: [ImageServerParser],
    Stringifier: ImageStringifier,
    async createPreRenderData(node, runtime: EruditBitranRuntime) {
        if (!runtime)
            throw new Error('Missing runtime when prerendering image element!');

        const src = toAbsoluteContentId(
            node.parseData.src,
            runtime.context.location.path!,
            getNavBookIds(),
        );

        const fullPath = await getFileFullPath(src);

        if (!fullPath) throw new Error(`Image file not found: ${src}`);

        const dimensions = await imageSizeFromFile(
            PROJECT_DIR + '/content/' + fullPath,
        );

        return {
            resolvedSrc: fullPath,
            size: {
                width: dimensions.width,
                height: dimensions.height,
            },
        };
    },
});
