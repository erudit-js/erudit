import {
    dedent,
    ObjBlockParseFactory,
    StringifyFactory,
    toStrObjectBlock,
    type ObjBlockParseMode,
} from '@bitran-js/transpiler';

import {
    diagramName,
    type DiagramParseData,
    type DiagramSchema,
} from './shared';
import {
    parseRawCaption,
    toRawCaptionObj,
    validateRawCaption,
} from '../../shared/figure/caption';

export class DiagramParser extends ObjBlockParseFactory<DiagramSchema> {
    override objName = diagramName;

    override getParseMode(content: string): ObjBlockParseMode {
        const objectMarkers = ['    caption:', 'content: |'];
        return objectMarkers.some((marker) => content.includes(marker))
            ? 'object'
            : 'string';
    }

    override async parseDataFromObj(diagram: any): Promise<DiagramParseData> {
        const validateDiagram = (diagram: string) => {
            if (typeof diagram !== 'string' || !diagram.trim()) {
                throw new Error('Mermaid diagram must be a non-empty string!');
            }
        };

        if (typeof diagram === 'string') {
            validateDiagram(diagram);
            return { content: dedent(diagram) };
        }

        validateDiagram(diagram.content);

        const parseData: DiagramParseData = { content: diagram.content };

        if (diagram.caption) {
            validateRawCaption(diagram.caption);
            const caption = await parseRawCaption(
                diagram.caption,
                this.payload().node,
                this,
            );
            parseData.caption = caption;
        }

        return parseData;
    }
}

export class DiagramStringifier extends StringifyFactory<DiagramSchema> {
    override async stringifyElement(): Promise<string> {
        const { parseData } = this.payload();

        if (!parseData.caption) {
            return toStrObjectBlock(diagramName, parseData.content);
        }

        const rawCaption = await toRawCaptionObj(
            parseData.caption,
            this.stringifier,
        );

        return toStrObjectBlock(diagramName, {
            ...rawCaption,
            content: parseData.content,
        });
    }
}
