import { styleText } from 'node:util';
import { globSync } from 'glob';
import { existsSync, readdirSync } from 'node:fs';
import { contentTypes, type ContentType } from '@erudit-js/core/content/type';

import type { ContentNavNode, ContentNavMap } from './types';

let initialBuild = true;

const contentRoot = () => ERUDIT.paths.project('content');

export async function buildContentNav() {
  ERUDIT.log.debug.start('Building content navigation...');

  const isInitial = initialBuild;
  initialBuild = false;

  if (!isInitial && !hasContentChanges()) {
    ERUDIT.log.info('Skipping content navigation — nothing changed.');
    return;
  }

  ERUDIT.contentNav.id2Node = new Map();
  ERUDIT.contentNav.id2Root = new Map();
  ERUDIT.contentNav.id2Books = new Map();
  ERUDIT.contentNav.short2Full = new Map();

  const cwd = contentRoot();
  const contentDirectories = globSync('**/*/', {
    cwd,
    posix: true,
  }).sort((a, b) => {
    if (a === b) return 0;
    if (a.startsWith(b)) return 1;
    if (b.startsWith(a)) return -1;
    return a.localeCompare(b);
  });

  //
  // Creating standalone nodes with no parent/children
  //

  ERUDIT.log.debug.start(`Creating standalone content navigation nodes...`);

  for (const dir of contentDirectories) {
    const node = await createStandaloneContentNavNode(cwd, dir);
    if (node) {
      ERUDIT.contentNav.id2Node.set(node.fullId, node);
      ERUDIT.contentNav.short2Full.set(node.shortId, node.fullId);
      if (node.type === 'book') {
        ERUDIT.contentNav.id2Books.set(node.fullId, node);
      }
    }
  }

  //
  // Creating parent-child relationships
  //

  ERUDIT.log.debug.start(`Creating parent-child relationships...`);

  for (const node of ERUDIT.contentNav.id2Node.values()) {
    const parentFullId = node.fullId.includes('/')
      ? node.fullId.slice(0, node.fullId.lastIndexOf('/'))
      : undefined;

    if (parentFullId) {
      const parentNode = ERUDIT.contentNav.id2Node.get(parentFullId);
      if (parentNode) {
        node.parent = parentNode;
        (parentNode.children ||= []).push(node);
      }
    }

    if (!node.parent) {
      ERUDIT.contentNav.id2Root.set(node.fullId, node);
    }
  }

  //
  // Ensuring nodes make sense
  //

  ERUDIT.log.debug.start(`Validating content navigation nodes...`);

  const validators = [
    duplicateIdValidator(),
    subsetValidator(),
    bookCantSkipValidator(),
    bookInsideBookValidator(),
    topicsWithoutPartsValidator(),
    emptyGroupsBooksValidator(),
  ];

  for (const validator of validators) {
    for (const node of ERUDIT.contentNav.id2Node.values()) {
      validator.step(node, ERUDIT.contentNav.id2Node);
    }
    const toRemoveIds = new Set(validator.getRemoveIds());
    if (toRemoveIds.size) {
      for (const id of toRemoveIds) {
        const node = ERUDIT.contentNav.id2Node.get(id);
        if (!node) continue;

        ERUDIT.contentNav.id2Node.delete(id);
        ERUDIT.contentNav.short2Full.delete(node.shortId);
        ERUDIT.contentNav.id2Books.delete(id);
        ERUDIT.contentNav.id2Root.delete(id);

        if (node.parent?.children) {
          node.parent.children = node.parent.children.filter(
            (child) => child !== node,
          );
          if (!node.parent.children.length) {
            node.parent.children = undefined;
          }
        }

        if (node.children) {
          for (const child of node.children) {
            if (!toRemoveIds.has(child.fullId)) {
              child.parent = undefined;
            }
          }
          node.children = undefined;
        }

        node.parent = undefined;
      }
    }
  }

  const stats = ERUDIT.contentNav.id2Node.size
    ? getContentNavStats(ERUDIT.contentNav.id2Node)
    : styleText('gray', 'empty');

  ERUDIT.log.success(
    isInitial
      ? `Content navigation build complete! (${stats})`
      : `Content navigation updated! (${stats})`,
  );
}

/**
 * Analizes given directory and creates corresponding ContentNavNode if possible.
 * The node is standalone and has no parent/children properties.
 */
async function createStandaloneContentNavNode(
  cwd: string,
  relPath: string,
): Promise<ContentNavNode | undefined> {
  const parsedContentPath = parseContentPath(relPath);
  if (!parsedContentPath) return;

  const dirPath = `${cwd}/${relPath}`;

  if (!existsSync(dirPath)) {
    return;
  }

  const files = readdirSync(dirPath).reduce<Record<string, null>>(
    (acc, name) => {
      acc[name] = null;
      return acc;
    },
    {},
  );

  for (const contentType of contentTypes) {
    if (hasJsTsModuleKey(files, contentType)) {
      return {
        type: contentType,
        contentRelPath: relPath,
        ...parsedContentPath,
      };
    }
  }
}

/**
 * Converts a filesystem path to fullId, shortId, position and ID part skip status.
 *
 * Example path: `01-foo/5+bar/03-baz`
 *
 * Resulting object:
 *
 * ```
 * {
 *   fullId: `foo/bar/baz`,
 *   shortId: `foo/bar`,
 *   position: 3,
 *   skip: false
 * }
 * ```
 */
function parseContentPath(relPath: string):
  | {
      idPart: string;
      fullId: string;
      shortId: string;
      position: number;
      skip: boolean;
    }
  | undefined {
  const parts = relPath.split('/');

  if (!parts.length) {
    return;
  }

  let idPart = '';
  let fullId = '';
  let shortId = '';
  let position!: number;
  let skip!: boolean;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const typeDelimiterPos = part!.search(/[+-]/);
    if (typeDelimiterPos <= 0) return;

    const posStr = part!.slice(0, typeDelimiterPos);
    if (!/^\d+$/.test(posStr)) return;
    const posNum = Number(posStr);

    const typeDelimiter = part!.charAt(typeDelimiterPos);
    skip = typeDelimiter === '+';
    idPart = part!.slice(typeDelimiterPos + 1);
    if (!idPart) return;

    fullId += `/${idPart}`;

    if (!skip || i === parts.length - 1) {
      shortId += `/${idPart}`;
    }

    position = posNum;
  }

  fullId = fullId.slice(1);
  shortId = shortId.slice(1);

  return {
    idPart,
    fullId,
    shortId,
    position,
    skip,
  };
}

function hasJsTsModuleKey(obj: Object, modulename: string) {
  const extensions = ['.js', '.jsx', '.ts', '.tsx'];
  return extensions.some((ext) => `${modulename}${ext}` in obj);
}

function getContentNavStats(id2Node: ContentNavMap) {
  const firstCapital = (s: string) => s.charAt(0).toUpperCase();
  const parts: string[] = [];

  let total = 0;
  let rootTotal = 0;
  const typeCounts = new Map<ContentType, number>();

  for (const node of id2Node.values()) {
    total++;
    if (!node.parent) {
      rootTotal++;
    }

    let tc = typeCounts.get(node.type);
    if (!tc) {
      tc = 0;
      typeCounts.set(node.type, tc);
    }
    typeCounts.set(node.type, tc + 1);
  }

  const push = (label: string, count: number) => {
    if (count === 0) return;
    parts.push(`${label} ${ERUDIT.log.stress(count)}`);
  };

  push('All:', total);
  push('R:', rootTotal);

  for (const type of contentTypes) {
    const tc = typeCounts.get(type as ContentType);
    if (!tc) continue;
    push(firstCapital(String(type)), tc);
  }

  return parts.join('; ');
}

function hasContentChanges() {
  for (const file of (ERUDIT.changedFiles || new Set<string>()).values()) {
    if (file.startsWith(`${contentRoot()}/`)) {
      return true;
    }
  }

  return false;
}

//
// Validators
//

type ContentNavValidatorInstance = {
  step(navNode: ContentNavNode, id2Node: ContentNavMap): void;
  getRemoveIds(): string[];
};
type ContentNavValidator = () => ContentNavValidatorInstance;

const duplicateIdValidator: ContentNavValidator = () => {
  const seenShortIds = new Map<string, string>();
  const duplicateIds: string[] = [];
  return {
    step(navNode) {
      if (seenShortIds.has(navNode.shortId)) {
        ERUDIT.log.warn(
          `
Content navigation node short ID duplication!
+ ${seenShortIds.get(navNode.shortId)}
+ ${navNode.fullId}
    -> ${styleText('yellow', navNode.shortId)}
                    `.trim(),
        );
        duplicateIds.push(navNode.fullId);
      } else {
        seenShortIds.set(navNode.shortId, navNode.fullId);
      }
    },
    getRemoveIds() {
      return duplicateIds;
    },
  };
};

const subsetValidator: ContentNavValidator = () => {
  const wrongSubsetIds: string[] = [];
  return {
    step(navNode) {
      const isGroupLike = ['group', 'book'].includes(navNode.type);
      const hasChildren = ERUDIT.contentNav.hasChildren(navNode);
      if (!isGroupLike && hasChildren) {
        ERUDIT.log.warn(
          `
Only groups and books can have children!
-> ${styleText('yellow', navNode.fullId)}
                    `.trim(),
        );
        wrongSubsetIds.push(navNode.fullId);
      }
    },
    getRemoveIds() {
      return wrongSubsetIds;
    },
  };
};

const bookCantSkipValidator: ContentNavValidator = () => {
  const wrongBookIds: string[] = [];
  return {
    step(navNode) {
      if (navNode.type === 'book' && navNode.skip) {
        ERUDIT.log.warn(
          `
Books can not be skipped!
    -> ${navNode.contentRelPath.split('/').slice(0, -1).join('/')}/${styleText('yellow', navNode.contentRelPath.split('/').pop()!)}
                    `.trim(),
        );
        wrongBookIds.push(navNode.fullId);
      }
    },
    getRemoveIds() {
      return wrongBookIds;
    },
  };
};

const topicsWithoutPartsValidator: ContentNavValidator = () => {
  const topicWithoutPartsIds: string[] = [];
  return {
    step(navNode) {
      if (navNode.type === 'topic') {
        const files = readdirSync(
          ERUDIT.paths.project(`content/${navNode.contentRelPath}`),
        );
        const hasPart = files.some((file) =>
          /^(article|summary|practice)\.(jsx|tsx)$/.test(file),
        );
        if (!hasPart) {
          ERUDIT.log.warn(
            `Topic ${ERUDIT.log.stress(navNode.fullId)} does not have article, summary, or practice (.jsx/.tsx) file!`.trim(),
          );
          topicWithoutPartsIds.push(navNode.fullId);
        }
      }
    },
    getRemoveIds() {
      return topicWithoutPartsIds;
    },
  };
};

const bookInsideBookValidator: ContentNavValidator = () => {
  const subsequentBookIds: string[] = [];
  return {
    step(navNode) {
      if (navNode.type === 'book') {
        let parent: ContentNavNode | undefined = navNode.parent;
        while (parent) {
          if (parent.type === 'book') {
            subsequentBookIds.push(navNode.fullId);
            break;
          }
          parent = parent.parent;
        }
      }
    },
    getRemoveIds() {
      return subsequentBookIds;
    },
  };
};

const emptyGroupsBooksValidator: ContentNavValidator = () => {
  const emptyGroupBookIds: string[] = [];
  return {
    step(navNode) {
      const isGroupOrBook = navNode.type === 'group' || navNode.type === 'book';

      if (!isGroupOrBook) return;

      function hasTopicOrPage(node: ContentNavNode): boolean {
        if (node.type === 'topic' || node.type === 'page') {
          return true;
        }
        if (!node.children) return false;
        return node.children.some((child) => hasTopicOrPage(child));
      }

      if (!hasTopicOrPage(navNode)) {
        const prettyType =
          navNode.type.charAt(0).toUpperCase() + navNode.type.slice(1);

        ERUDIT.log.warn(
          `${prettyType} ${ERUDIT.log.stress(navNode.fullId)} does not have any topic or page descendants!`,
        );
        emptyGroupBookIds.push(navNode.fullId);
      }
    },
    getRemoveIds() {
      return emptyGroupBookIds;
    },
  };
};
