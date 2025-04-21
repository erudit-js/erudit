import {
    dedent,
    indent,
    isPlainObject,
    ObjBlockParseFactory,
    StringifyFactory,
    stringifyYAML,
    toStrObjectBlock,
    type ObjBlockParseMode,
} from '@bitran-js/transpiler';

import { tableName, type TableParseData, type TableSchema } from './shared';
import {
    parseRawCaption,
    toRawCaptionObj,
    validateRawCaption,
} from '../../shared/figure/caption';

export class TableParser extends ObjBlockParseFactory<TableSchema> {
    override objName = tableName;

    override getParseMode(content: string): ObjBlockParseMode {
        const objectMarkers = ['maxWidth: ', '    caption:', 'cells: |'];
        return objectMarkers.some((marker) => content.includes(marker))
            ? 'object'
            : 'string';
    }

    override async parseDataFromObj(content: any): Promise<TableParseData> {
        if (isPlainObject(content)) {
            if (!content.cells || typeof content.cells !== 'string') {
                throw new Error(
                    'Table with object format must have "cells" string property!',
                );
            }

            const cells = await this.parseCells(content.cells);
            const result: TableParseData = { cells };

            if (content.maxWidth) {
                result.maxWidth = String(content.maxWidth);
            }

            if (content.caption) {
                validateRawCaption(content.caption);
                const caption = await parseRawCaption(
                    content.caption,
                    this.payload().node,
                    this,
                );
                result.caption = caption;
            }

            return result;
        }

        if (typeof content !== 'string') {
            throw new Error(
                'Expected table data to be a string, or object with cells',
            );
        }

        if (content.trim() === '') {
            throw new Error('Table data cannot be empty!');
        }

        const cells = await this.parseCells(dedent(content));
        return { cells };
    }

    private async parseCells(
        cellsData: string,
    ): Promise<TableParseData['cells']> {
        const rows = cellsData.trim().split('\n');

        return Promise.all(
            rows.map(async (row) => {
                // Split the row by | character, but respect escaping
                const cells: string[] = [];
                let currentCell = '';
                let isEscaped = false;

                for (let i = 0; i < row.length; i++) {
                    const char = row[i];

                    if (char === '\\' && !isEscaped) {
                        isEscaped = true;
                        continue;
                    }

                    if (char === '|' && !isEscaped) {
                        cells.push(currentCell);
                        currentCell = '';
                    } else {
                        currentCell += char;
                        isEscaped = false;
                    }
                }

                // Add the last cell
                cells.push(currentCell);

                // Parse each cell as inline content
                return Promise.all(
                    cells.map(async (cellContent) => {
                        return this.parseInliners(cellContent);
                    }),
                );
            }),
        );
    }
}

export class TableStringifier extends StringifyFactory<TableSchema> {
    override async stringifyElement(): Promise<string> {
        const { parseData } = this.payload();

        // Format each row with | separators
        const formattedRows = await Promise.all(
            parseData.cells.map(async (row) => {
                const stringifiedCells = await Promise.all(
                    row.map(async (cellContent) => {
                        const content = await this.stringify(cellContent);
                        // Escape pipe characters in cell content
                        return content.replace(/\|/g, '\\|');
                    }),
                );

                return stringifiedCells.join('|');
            }),
        );

        let tableContent = formattedRows.join('\n');

        if (parseData.caption || parseData.maxWidth) {
            let yamlObj: Record<string, any> = {};

            if (parseData.maxWidth) {
                yamlObj.maxWidth = parseData.maxWidth;
            }

            if (parseData.caption) {
                const rawCaptionObj = await toRawCaptionObj(
                    parseData.caption,
                    this.stringifier,
                );
                Object.assign(yamlObj, rawCaptionObj);
            }

            tableContent = `${stringifyYAML(yamlObj)}\ncells: |\n${indent(tableContent)}`;
        }

        return toStrObjectBlock(tableName, tableContent);
    }
}
