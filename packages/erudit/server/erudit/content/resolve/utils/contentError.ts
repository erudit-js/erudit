import chalk from 'chalk';
import type { ContentNavNode } from '../../nav/types';

export function logContentError(contentNode: ContentNavNode) {
    ERUDIT.log.error(
        `Error parsing ${contentNode.type} ${ERUDIT.log.stress(
            contentNode.fullId,
        )}!\nLocation: ${chalk.red(ERUDIT.paths.project(`content/${contentNode.contentRelPath}`))}`,
    );
}
