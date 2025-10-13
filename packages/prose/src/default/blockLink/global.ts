import { defineGlobalElement } from '../../globalElement';
import { BlockLink, blockLinkName, type BlockLinkSchema } from '.';

export default defineGlobalElement<BlockLinkSchema>()({
    name: blockLinkName,
    tags: { BlockLink },
});
