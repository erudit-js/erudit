import chalk from 'chalk';
import { inArray, or } from 'drizzle-orm';
import { contentPathToId } from '@erudit-js/core/content/path';

import { resolveGroup } from './group';
import { resolveBook } from './book';
import { resolvePage } from './page';
import { resolveTopic } from './topic';

let initialResolve = true;

const contentRoot = () => ERUDIT.paths.project('content');

export async function resolveContent() {
  ERUDIT.log.debug.start('Resolving content...');

  const isInitial = initialResolve;
  initialResolve = false;

  const toResolveContentIds = collectContentIdsToResolve(isInitial);

  if (!toResolveContentIds.size) {
    ERUDIT.log.info(
      isInitial
        ? 'Skipping content — no content found.'
        : 'Skipping content — nothing changed.',
    );
    return;
  }

  if (!isInitial) {
    ERUDIT.log.info(renderChangedContentTree(toResolveContentIds));
  }

  await clearOldContentData(Array.from(toResolveContentIds));

  for (const contentId of toResolveContentIds) {
    const navNode = ERUDIT.contentNav.getNode(contentId);

    if (!navNode) {
      continue;
    }

    switch (navNode.type) {
      case 'book':
        await resolveBook(navNode);
        break;
      case 'group':
        await resolveGroup(navNode);
        break;
      case 'page':
        await resolvePage(navNode);
        break;
      case 'topic':
        await resolveTopic(navNode);
        break;
    }
  }

  ERUDIT.log.success(
    isInitial
      ? `Content resolved! (${ERUDIT.log.stress(toResolveContentIds.size)})`
      : `Content updated! (${ERUDIT.log.stress(toResolveContentIds.size)})`,
  );
}

function collectContentIdsToResolve(isInitial: boolean): Set<string> {
  if (isInitial) {
    return new Set(ERUDIT.contentNav.id2Node.keys());
  }

  if (!hasContentChanges()) {
    return new Set();
  }

  const ids = new Set<string>();
  const changedFiles = ERUDIT.changedFiles || new Set<string>();

  for (const changedFile of changedFiles.values()) {
    if (!changedFile.startsWith(`${contentRoot()}/`)) continue;

    const contentId =
      contentPathToId(changedFile, ERUDIT.paths.project(), 'full') ||
      deriveContentIdFromPath(changedFile);

    if (!contentId) continue;

    const navNode = ERUDIT.contentNav.getNode(contentId);

    if (navNode) {
      ERUDIT.contentNav.walkSync((node) => {
        ids.add(node.fullId);
      }, navNode);

      ERUDIT.contentNav.walkUpSync((node) => {
        ids.add(node.fullId);
      }, navNode);
      continue;
    }

    addAncestorIds(ids, contentId);
  }

  return ids;
}

function hasContentChanges() {
  for (const file of (ERUDIT.changedFiles || new Set<string>()).values()) {
    if (file.startsWith(`${contentRoot()}/`)) {
      return true;
    }
  }

  return false;
}

function addAncestorIds(target: Set<string>, contentId: string) {
  const parts = contentId.split('/').filter(Boolean);

  for (let i = 1; i <= parts.length; i++) {
    target.add(parts.slice(0, i).join('/'));
  }
}

function deriveContentIdFromPath(path: string): string | undefined {
  if (!path.startsWith(`${contentRoot()}/`)) return;

  const rel = path.slice(contentRoot().length + 1);
  const segments = rel.split('/');

  // Drop filename if present
  if (segments.length && segments[segments.length - 1].includes('.')) {
    segments.pop();
  }

  if (!segments.length) return;

  const idParts: string[] = [];

  for (const seg of segments) {
    const match = seg.match(/^(\d+)[+-](.+)$/);
    if (!match) return;
    const [, , idPart] = match;
    if (!idPart) return;
    idParts.push(idPart);
  }

  return idParts.join('/');
}

function renderChangedContentTree(ids: Set<string>): string {
  const sorted = Array.from(ids).sort((a, b) => {
    const al = a.split('/').length;
    const bl = b.split('/').length;
    if (al !== bl) return al - bl;
    return a.localeCompare(b);
  });

  type Node = { name: string; children: Map<string, Node> };
  const root: Node = { name: '', children: new Map() };

  const ensureNode = (parent: Node, part: string): Node => {
    let next = parent.children.get(part);
    if (!next) {
      next = { name: part, children: new Map() };
      parent.children.set(part, next);
    }
    return next;
  };

  for (const id of sorted) {
    let cursor = root;
    for (const part of id.split('/')) {
      cursor = ensureNode(cursor, part);
    }
  }

  const lines: string[] = [];

  const walkTree = (node: Node, depth: number) => {
    if (node.name) {
      const indent = '  '.repeat(Math.max(0, depth - 1));
      lines.push(`${indent}- ${chalk.cyan(node.name)}`);
    }

    const children = Array.from(node.children.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    children.forEach((child) => {
      walkTree(child, depth + 1);
    });
  };

  const roots = Array.from(root.children.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  roots.forEach((child) => {
    walkTree(child, 1);
  });

  const header = chalk.gray('Changed content:');
  return [header, ...lines].join('\n');
}

export async function clearOldContentData(contentIds: string[]) {
  await ERUDIT.db
    .delete(ERUDIT.db.schema.content)
    .where(inArray(ERUDIT.db.schema.content.fullId, contentIds));

  await ERUDIT.db
    .delete(ERUDIT.db.schema.groups)
    .where(inArray(ERUDIT.db.schema.groups.fullId, contentIds));

  await ERUDIT.db
    .delete(ERUDIT.db.schema.pages)
    .where(inArray(ERUDIT.db.schema.pages.fullId, contentIds));

  await ERUDIT.db
    .delete(ERUDIT.db.schema.topics)
    .where(inArray(ERUDIT.db.schema.topics.fullId, contentIds));

  await ERUDIT.db.delete(ERUDIT.db.schema.files).where(
    inArray(
      ERUDIT.db.schema.files.role,
      contentIds.flatMap((id) => [
        `content-item:${id}`,
        `content-decoration:${id}`,
      ]),
    ),
  );

  await ERUDIT.db
    .delete(ERUDIT.db.schema.contentDeps)
    .where(
      or(
        inArray(ERUDIT.db.schema.contentDeps.toFullId, contentIds),
        inArray(ERUDIT.db.schema.contentDeps.fromFullId, contentIds),
      ),
    );

  await ERUDIT.db
    .delete(ERUDIT.db.schema.contentElementStats)
    .where(inArray(ERUDIT.db.schema.contentElementStats.fullId, contentIds));

  await ERUDIT.db
    .delete(ERUDIT.db.schema.contentProseLinks)
    .where(
      or(inArray(ERUDIT.db.schema.contentProseLinks.fromContentId, contentIds)),
    );

  await ERUDIT.db
    .delete(ERUDIT.db.schema.contentContributions)
    .where(
      inArray(ERUDIT.db.schema.contentContributions.contentFullId, contentIds),
    );

  await ERUDIT.db
    .delete(ERUDIT.db.schema.contentUniques)
    .where(inArray(ERUDIT.db.schema.contentUniques.contentFullId, contentIds));

  await ERUDIT.db
    .delete(ERUDIT.db.schema.contentSnippets)
    .where(inArray(ERUDIT.db.schema.contentSnippets.contentFullId, contentIds));

  await ERUDIT.db
    .delete(ERUDIT.db.schema.problemScripts)
    .where(inArray(ERUDIT.db.schema.problemScripts.contentFullId, contentIds));

  await ERUDIT.db
    .delete(ERUDIT.db.schema.contentToc)
    .where(inArray(ERUDIT.db.schema.contentToc.fullId, contentIds));
}

export function requestFullContentResolve() {
  initialResolve = true;
}
