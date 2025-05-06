import { globSync } from 'glob';
import chalk from 'chalk';
import {
    contentTypes,
    topicParts,
    type ContentType,
} from '@erudit-js/cog/schema';

import { PROJECT_DIR } from '#erudit/globalPaths';
import { stress } from '@erudit/utils/stress';
import { debug, logger } from '@server/logger';
import {
    createRootNode,
    isRootNode,
    type NavNode,
    type RootNavNode,
} from '@server/nav/node';
import { ERUDIT_SERVER } from '@server/global';
import { readFileSync } from 'fs';

type Ids = Record<string, string>;
let ids: Ids;

const nodePathRegexp = new RegExp(
    `(?<pos>\\d+)(?<sep>-|\\+)(?<id>[\\w-]+)\\/(?<type>${contentTypes.join('|')})\\..*`,
);

const contentFilter = createContentFilter();

export async function buildNav() {
    debug.start('Building navigation tree...');

    ids = {};

    const rootNode = createRootNode();
    rootNode.children = (await scanChildNodes(rootNode, false)).children;
    ERUDIT_SERVER.NAV = rootNode.children ? rootNode : undefined;

    const nodeCount = Object.values(ids).length;

    if (nodeCount === 0) {
        logger.warn('No content nodes detected! The site will be empty!');
    } else {
        if (ERUDIT_SERVER.CONFIG?.debug?.log) debugPrintNav(rootNode);

        logger.success(
            'Navigation tree built successfully!',
            chalk.dim(`(${nodeCount})`),
        );
    }
}

async function scanChildNodes(
    parent: NavNode | RootNavNode,
    insideBook: boolean,
): Promise<{ children: NavNode[] | undefined; newIds: Ids }> {
    const currentFsPath = isRootNode(parent) ? '' : parent.path + '/';

    const nodeFsPaths = globSync(
        `${currentFsPath}*/{${contentTypes.join(',')}}.{ts,js}`,
        {
            cwd: PROJECT_DIR + '/content',
            posix: true,
        },
    ).sort();

    let newIds: Ids = {};
    const children: NavNode[] = [];

    for (const nodeFsPath of nodeFsPaths) {
        const pathParts:
            | {
                  pos: string;
                  sep: string;
                  id: string;
                  type: ContentType;
              }
            | undefined = nodeFsPath.match(nodePathRegexp)?.groups as any;

        if (!pathParts) continue; // Wrong path pattern

        const nodePath = nodeFsPath.split('/').slice(0, -1).join('/');

        if (pathParts.type === 'book' && insideBook) {
            logger.warn(
                'Books inside books are not allowed!\n',
                `Skipping ${stress(nodePath)} nav node!`,
            );
            continue;
        }

        const parentId = isRootNode(parent)
            ? ''
            : parent.skip
              ? parent.fullId.split('/').slice(0, -1).join('/')
              : parent.fullId;

        // Regular id might not include parent id part if it is skipped
        const id = parentId ? `${parentId}/${pathParts.id}` : pathParts.id;

        if (ids[id]) {
            logger.warn(
                `Nav node ${stress(id)} ID collision!\n\n`,
                `This ID belongs to ${stress(ids[id], chalk.greenBright)} nav node.\n`,
                `Nav node ${stress(nodePath, chalk.redBright)} tries to use the same ID!\n`,
                'Skipping nav node which causes collision!',
            );
            continue;
        }

        // Full id always includes parent id
        const fullId = isRootNode(parent)
            ? pathParts.id
            : `${parent.fullId}/${pathParts.id}`;

        // Short id skips parent ids for nodes with skip=true, except current node
        const shortId = isRootNode(parent)
            ? pathParts.id
            : (() => {
                  // Traverse up, skipping parent ids where skip=true
                  let ids: string[] = [];
                  let p: NavNode | RootNavNode | undefined = parent;
                  while (p && !isRootNode(p)) {
                      if (!p.skip) ids.unshift(p.idPart);
                      p = p.parent;
                  }
                  ids.push(pathParts.id);
                  return ids.join('/');
              })();

        const shouldSkip = (() => {
            const targets = [
                ...contentFilter.cliContentTargets,
                ...(ERUDIT_SERVER.CONFIG?.contentTargets || []),
            ];

            // If there are no filters, allow all nodes
            if (targets.length === 0) {
                return false;
            }

            // If the node passes at least one filter, keep it
            for (const target of targets) {
                if (contentFilter.strFilter(fullId, target)) {
                    return false;
                }
            }

            // Node failed all filters, skip it
            return true;
        })();

        if (shouldSkip) continue;

        const skip = pathParts.sep === '+';

        const childNode: NavNode = {
            parent,
            type: pathParts.type,
            path: nodePath,
            idPart: pathParts.id,
            fullId,
            shortId,
            skip,
        };

        if (!validNode(childNode)) continue;

        ids[id] = nodePath;
        newIds[id] = nodePath;

        const scanResult = await scanChildNodes(
            childNode,
            insideBook || childNode.type === 'book',
        );

        if (
            ['book', 'group'].includes(childNode.type) &&
            !scanResult.children
        ) {
            delete ids[id];
            delete newIds[id];
            for (const childNewId of Object.keys(scanResult.newIds))
                delete ids[childNewId];
            continue;
        }

        if (childNode.type === 'book') {
            ERUDIT_SERVER.NAV_BOOKS ||= {};
            ERUDIT_SERVER.NAV_BOOKS[id] = childNode;
        }

        childNode.children = scanResult.children;
        children.push(childNode);
    }

    return {
        children: children.length > 0 ? children : undefined,
        newIds,
    };
}

function createContentFilter() {
    const cliContentTargets = (() => {
        try {
            return JSON.parse(
                readFileSync(PROJECT_DIR + '/.erudit/targets.json', 'utf-8'),
            );
        } catch (error) {}

        return [];
    })();

    const strFilter = (fullId: string, filterItem: string) => {
        if (fullId.startsWith(filterItem) || filterItem.search(fullId) === 0) {
            return true;
        }

        return false;
    };

    return {
        cliContentTargets,
        strFilter,
    };
}

function validNode(node: NavNode): boolean {
    switch (node.type) {
        case 'topic':
            const partPaths = globSync(
                PROJECT_DIR +
                    `/content/${node.path}` +
                    `/{${topicParts.join(',')}}.bi`,
            );
            if (partPaths.length === 0) return false; // Topic is empty
            break;
        case 'book':
            if (node.skip) {
                logger.warn(
                    `Books can't skip their ID part!\n`,
                    `Skipping ${stress(node.path)} nav node!`,
                );
                return false;
            }
            break;
    }

    return true;
}

function debugPrintNav(node: RootNavNode) {
    const logNode = (node: NavNode | RootNavNode, indent: number) => {
        console.log(
            isRootNode(node)
                ? chalk.dim('#root')
                : `${'  '.repeat(indent)}${node.idPart} ${chalk.dim(`[${node.type}${node.skip ? ', ' + chalk.yellow('skip') : ''}]`)}`,
        );

        if (node.children)
            for (const child of node.children) logNode(child, indent + 1);
    };

    logNode(node, 0);
}
