import { inArray } from 'drizzle-orm';
import { globSync } from 'glob';
import type { AnySchema, RawElement } from '@jsprose/core';

import { resolveEruditProse } from '../prose/repository/resolve';

let initialBuild = true;

export async function buildNews() {
    ERUDIT.log.debug.start('Building news...');

    const newsFilenames = new Set<string>();

    if (initialBuild) {
        initialBuild = false;
        globSync(`[0-9][0-9][0-9][0-9].[0-9][0-9].[0-9][0-9].tsx`, {
            posix: true,
            cwd: ERUDIT.config.paths.project + '/news',
        }).forEach((filePath) => newsFilenames.add(filePath));
    } else {
        for (const changedFile of ERUDIT.changedFiles.values()) {
            if (
                changedFile.startsWith(ERUDIT.config.paths.project + '/news/')
            ) {
                const relativePath = changedFile.replace(
                    ERUDIT.config.paths.project + '/news/',
                    '',
                );

                if (relativePath.match(/^[0-9]{4}\.[0-9]{2}\.[0-9]{2}\.tsx$/)) {
                    newsFilenames.add(relativePath);
                }
            }
        }

        await ERUDIT.db.delete(ERUDIT.db.schema.news).where(
            inArray(
                ERUDIT.db.schema.news.date,
                Array.from(newsFilenames).map((filename) =>
                    filename.replace('.tsx', ''),
                ),
            ),
        );
    }

    for (const filename of newsFilenames) {
        await buildNewsItem(filename);
    }
}

export async function buildNewsItem(filename: string) {
    ERUDIT.log.debug.start(
        `Building news item ${ERUDIT.log.stress(filename)}...`,
    );

    try {
        const newsModule = await ERUDIT.import<{
            default: RawElement<AnySchema>;
        }>(`${ERUDIT.config.paths.project}/news/${filename}`);

        const resolvedProse = await resolveEruditProse(
            newsModule.default,
            false,
        );

        await ERUDIT.db.insert(ERUDIT.db.schema.news).values({
            date: filename.replace('.tsx', ''),
            prose: resolvedProse.proseElement,
        });
    } catch (error) {
        ERUDIT.log.error(
            `Failed to build news item ${ERUDIT.log.stress(filename)}!\n` +
                String(error),
        );
        return;
    }
}
