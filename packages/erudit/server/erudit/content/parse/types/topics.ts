import { ContentParser } from '..';
import type { ContentNavNode } from '../../nav/types';

export const topicsParser: ContentParser = async () => {
    return {
        step: async (navNode: ContentNavNode) => {
            // console.log(navNode.type + ' ' + navNode.fullId);
            // Implement the parsing logic for page nodes here
        },
        finally: async () => {
            // Implement any finalization logic here
        },
    };
};
