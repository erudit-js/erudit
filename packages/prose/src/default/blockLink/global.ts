import { BlockLink, blockLinkName, type BlockLinkSchema } from '.';
import { defineGlobalElement } from '../../globalElement';

export default defineGlobalElement<BlockLinkSchema>()({
    name: blockLinkName,
    tags: { BlockLink },
});
