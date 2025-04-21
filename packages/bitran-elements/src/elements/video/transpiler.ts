import { defineElementTranspiler } from '@bitran-js/transpiler';

import { VideoNode, type VideoSchema } from './shared';
import { VideoParser, VideoStringifier } from './factory';

export const videoTranspiler = defineElementTranspiler<VideoSchema>({
    Node: VideoNode,
    Parsers: [VideoParser],
    Stringifier: VideoStringifier,
});
