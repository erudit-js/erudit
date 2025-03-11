import { BlockParseFactory, StringifyFactory } from '@bitran-js/transpiler';

import type { HeadingNode, HeadingParseData, HeadingSchema } from './shared';

export type SlugifyFunction = (text: string) => string;
export type SlugifyLoaders = Record<
    string,
    () => Promise<{ default: SlugifyFunction }>
>;

const slugifyLoader: SlugifyLoaders = {
    ru: async () => import('./slugify/ru'),
};

export class HeadingParser extends BlockParseFactory<HeadingSchema> {
    regexp = /^(?<level>#+) (?<title>.+)$/;
    level!: number;
    title!: string;

    override canParse(strBlock: string): boolean {
        const [, strLevel, strTitle] = strBlock.match(this.regexp) ?? [];

        if (!strLevel) return false;
        this.level = strLevel.length;

        this.title = (strTitle || '').trim();
        if (!this.title) return false;

        return true;
    }

    override async createParseData(): Promise<HeadingParseData> {
        const validLevels = [1, 2, 3];

        if (!validLevels.includes(this.level))
            throw new Error(
                `Invalid heading level: ${
                    this.level
                }! Available levels: ${validLevels.join(', ')}.`,
            );

        if (!this.title) throw new Error('Heading title must not be empty!');

        return {
            level: this.level,
            title: this.title,
        };
    }

    override async alterAutoId(autoId: string, node: HeadingNode) {
        const { provide: { language = 'en' } = {} } = this.payload();

        const slugify = await (async () => {
            if (slugifyLoader[language]) {
                const { default: slugify } = await slugifyLoader[language]();
                return slugify;
            }

            return (text: string) => text;
        })();

        let slug = node.parseData.title.toLowerCase();

        slug = slugify(slug)
            .replace(/[^\p{L}\p{N}\s-]/gu, '')
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/\s/g, '-');

        // Return sanitized slug or fallback to autoId if empty
        return slug || autoId;
    }
}

export class HeadingStringifier extends StringifyFactory<HeadingSchema> {
    override async stringifyElement() {
        const {
            parseData: { level, title },
        } = this.payload();
        return `${'#'.repeat(level)} ${title}`;
    }
}
