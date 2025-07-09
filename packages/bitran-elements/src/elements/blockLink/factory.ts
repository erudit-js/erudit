import { BlockParseFactory, StringifyFactory } from '@bitran-js/transpiler';
import type { BlockLinkParseData, BlockLinkSchema } from './shared';

export class BlockLinkParser extends BlockParseFactory<BlockLinkSchema> {
    location!: string;
    label?: string;

    override canParse(strBlock: string): boolean {
        const lines = strBlock.trim().split('\n');
        const firstLine = lines[0]!.trim();

        // Check if first line matches the location pattern (with or without label)
        const match = /^~>\s*(\S+)(?:\s+(.+?))?$/.exec(firstLine);

        if (match) {
            this.location = match[1]!;

            // If there's a label on the same line, use it
            if (match[2]) {
                this.label = match[2];
            }
            // If no label on same line but there are additional lines, use them as label
            else if (lines.length > 1) {
                this.label = lines.slice(1).join('\n').trim();
            }

            return true;
        }

        return false;
    }

    override async createParseData(): Promise<BlockLinkParseData> {
        return {
            location: this.location,
            label: this.label?.trim(),
        };
    }
}

export class BlockLinkStringifier extends StringifyFactory<BlockLinkSchema> {
    override async stringifyElement(): Promise<string> {
        const { parseData } = this.payload();

        if (!parseData.label) {
            return `~> ${parseData.location}`;
        }

        // If label contains newlines, format as multi-line
        if (parseData.label.includes('\n')) {
            return `~> ${parseData.location}\n${parseData.label}`;
        }

        // Single line label
        return `~> ${parseData.location} ${parseData.label}`;
    }
}
