import {
    BlockParseFactory,
    ObjBlockParseFactory,
    StringifyFactory,
    toStrObjectBlock,
    type PlainObject,
} from '@bitran-js/transpiler';

import type { ListParseData, ListSchema } from './shared';

export class ListInlineParser extends BlockParseFactory<ListSchema> {
    override canParse(strBlock: string): boolean {
        if (strBlock.startsWith('* ')) return true;
        if (strBlock.match(/^\d+\. /)) return true;
        return false;
    }

    override async createParseData(strBlock: string): Promise<ListParseData> {
        const lines = strBlock.split('\n');
        const firstLine = lines[0]!;

        const orderedMatch = firstLine.match(/^(\d+)\. /);
        const isOrdered = !!orderedMatch;
        const type = isOrdered ? 'ol' : 'ul';
        const start = isOrdered ? parseInt(orderedMatch[1]!, 10) : 1;

        // Process items
        const rawItems: string[] = [];
        let currentItem = '';
        let expectedNumber = start;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]!;

            if (i === 0) {
                // First line is always the start of the first item
                currentItem = isOrdered
                    ? line.replace(/^\d+\. /, '')
                    : line.substring(2);
            } else if (isOrdered) {
                // For ordered lists, check if the line starts with the next expected number
                const match = line.match(/^(\d+)\. /);
                const lineNumber = match ? parseInt(match[1]!, 10) : null;

                if (lineNumber === expectedNumber + 1) {
                    // This is the next sequential item
                    rawItems.push(currentItem);
                    currentItem = line.replace(/^\d+\. /, '');
                    expectedNumber = lineNumber;
                } else {
                    // This is a continuation of the current item
                    currentItem += '\n' + line;
                }
            } else {
                // For unordered lists, check if the line starts with "* "
                if (line.startsWith('* ')) {
                    rawItems.push(currentItem);
                    currentItem = line.substring(2);
                } else {
                    currentItem += '\n' + line;
                }
            }
        }

        // Add the last item
        rawItems.push(currentItem);

        // Parse each item
        const items = [];
        for (const rawItem of rawItems) {
            items.push(await this.parseBlocks(rawItem));
        }

        return {
            isObj: false,
            type,
            items,
            ...(isOrdered ? { start } : {}),
        } as ListParseData;
    }
}

export class ListObjectParser extends ObjBlockParseFactory<ListSchema> {
    override objName = 'list';

    override async parseDataFromObj(obj: PlainObject): Promise<ListParseData> {
        const isObj = true;

        const type = obj.type;

        if (type !== 'ol' && type !== 'ul') {
            throw new Error(
                `Invalid list type "${type}"! Expected "ol" or "ul".`,
            );
        }

        const items = obj.items;

        if (
            !Array.isArray(items) ||
            !items.every((item) => typeof item === 'string')
        ) {
            throw new Error(
                'List object must have "items" property, which is an array of strings!',
            );
        }

        const parsedItems = [];
        for (const item of items) {
            parsedItems.push(await this.parseBlocks(item));
        }

        if (type === 'ol') {
            const { start } = obj;

            if (start !== undefined && typeof start !== 'number') {
                throw new Error(
                    'The "start" property of ordered list must be a number!',
                );
            }

            return {
                isObj,
                type,
                start: start !== undefined ? start : 1,
                items: parsedItems,
            };
        } else {
            return {
                isObj,
                type,
                items: parsedItems,
            };
        }
    }
}

export class ListStringifier extends StringifyFactory<ListSchema> {
    override async stringifyElement() {
        const { parseData } = this.payload();

        const isListObject =
            parseData.isObj ||
            parseData.items.some(
                (item) => item.children && item.children.length > 1,
            );

        const strItems = [];
        for (const item of parseData.items) {
            strItems.push(await this.stringify(item));
        }

        if (isListObject) {
            return toStrObjectBlock('list', {
                type: parseData.type,
                ...(parseData.type === 'ol' && parseData.start !== 1
                    ? { start: parseData.start }
                    : {}),
                items: strItems,
            });
        } else {
            if (parseData.type === 'ul') {
                return strItems.map((item) => `* ${item}`).join('\n');
            } else {
                let counter = parseData.start;
                return strItems
                    .map((item) => `${counter++}. ${item}`)
                    .join('\n');
            }
        }
    }
}
