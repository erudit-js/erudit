import {
    defineElementTranspiler,
    type PlainObject,
} from '@bitran-js/transpiler';
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

export function normalizeImageSrc(
    src: string,
    contextPath: string,
    insideInclude: boolean,
): string {
    if (insideInclude) {
        return '/' + toAbsoluteContentId(src, contextPath, getNavBookIds());
    }
    return src;
}

export async function getImageRenderData(src: string, contextPath: string) {
    const absoluteSrc = toAbsoluteContentId(src, contextPath, getNavBookIds());
    const fullPath = await getFileFullPath(absoluteSrc);

    if (!fullPath) throw new Error(`Image file not found: ${absoluteSrc}`);

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
}

//
//
//

export class ImageServerParser extends ImageParser {
    override async parseDataFromObj(obj: PlainObject): Promise<ImageParseData> {
        const parseData = await super.parseDataFromObj(obj);
        const { insideInclude, context } = getEruditBitranRuntime(this);

        parseData.src = normalizeImageSrc(
            parseData.src,
            context.location.path!,
            insideInclude,
        );

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

        return await getImageRenderData(
            node.parseData.src,
            runtime.context.location.path!,
        );
    },
});
