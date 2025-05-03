import {
    InlinerParseFactory,
    StringifyFactory,
    type Range,
} from '@bitran-js/transpiler';

import type { EmphasisParseData, EmphasisSchema } from './shared';

export class EmphasisParser extends InlinerParseFactory<EmphasisSchema> {
    // Find all *italic* and **bold** ranges, handling nesting and adjacency
    override outlineRanges(text: string): Range[] {
        const ranges: Range[] = [];
        // Stack of open markers
        const stack: {
            type: 'italic' | 'bold';
            pos: number;
            length: number;
        }[] = [];
        let i = 0;
        const len = text.length;

        while (i < len) {
            if (text[i] === '*') {
                // count consecutive stars
                let j = i;
                while (j < len && text[j] === '*') j++;
                const count = j - i;

                // build marker segments: treat *** as single italic, otherwise pairs then leftover
                const markers: { type: 'italic' | 'bold'; length: number }[] =
                    [];
                if (count === 3) {
                    markers.push({ type: 'italic', length: 3 });
                } else {
                    let pairs = Math.floor(count / 2);
                    for (let k = 0; k < pairs; k++)
                        markers.push({ type: 'bold', length: 2 });
                    if (count % 2 === 1)
                        markers.push({ type: 'italic', length: 1 });
                }

                // process each marker
                for (const m of markers) {
                    const { type, length: markLen } = m;
                    // check for matching open
                    const lastIndex = stack
                        .map((e) => e.type)
                        .lastIndexOf(type);
                    if (lastIndex !== -1 && stack[lastIndex]!.type === type) {
                        // closing marker: pop until match
                        let popped;
                        do {
                            popped = stack.pop()!;
                        } while (popped.type !== type && stack.length > 0);

                        // only record top-level closures
                        if (stack.length === 0) {
                            const start = popped.pos;
                            const end = i + markLen; // include closing stars
                            ranges.push({ start, end });
                        }
                    } else {
                        // opening marker
                        stack.push({ type, pos: i, length: markLen });
                    }
                }

                i = j;
            } else {
                i++;
            }
        }

        return ranges;
    }

    override async createParseData(
        strInliner: string,
    ): Promise<EmphasisParseData> {
        // Determine if it's bold or italic by checking delimiters
        if (strInliner.startsWith('**') && strInliner.endsWith('**')) {
            const content = strInliner.slice(2, -2);
            const inliners = await this.parseInliners(content);
            return {
                type: 'bold',
                inliners,
            };
        } else if (strInliner.startsWith('*') && strInliner.endsWith('*')) {
            const content = strInliner.slice(1, -1);
            const inliners = await this.parseInliners(content);
            return {
                type: 'italic',
                inliners,
            };
        }

        throw new Error(
            `Invalid emphasis format: ${strInliner}. Expected *italic* or **bold**.`,
        );
    }
}

export class EmphasisStringifier extends StringifyFactory<EmphasisSchema> {
    override async stringifyElement(): Promise<string> {
        const { parseData } = this.payload();
        const delimiter = parseData.type === 'bold' ? '**' : '*';
        return `${delimiter}${await this.stringify(parseData.inliners)}${delimiter}`;
    }
}
