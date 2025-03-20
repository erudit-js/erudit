import {
    ObjBlockParseFactory,
    ObjStringifyFactory,
    type RawObject,
} from '@bitran-js/transpiler';

import type { AccentParseData, AccentSchema, AccentSection } from './shared';

export class AccentParser extends ObjBlockParseFactory<AccentSchema> {
    override objName!: string;

    override canParse(strBlock: string): boolean {
        this.objName = this.payload().provide.objName;
        return super.canParse(strBlock);
    }

    override async parseDataFromObj(obj: RawObject): Promise<AccentParseData> {
        if ('main' in obj) {
            const main = obj.main.trim();

            if (typeof main !== 'string')
                throw new Error('Accent main must be a string!');

            if (!main) throw new Error('Accent main cannot be empty!');

            if ('sections' in obj) {
                // Handle complex type with main and sections
                const sections = obj.sections;

                if (
                    !sections ||
                    typeof sections !== 'object' ||
                    Array.isArray(sections)
                )
                    throw new Error(
                        'Accent sections must be a regular object!',
                    );

                const sectionKeys = Object.keys(sections);

                if (sectionKeys.length === 0)
                    throw new Error('Accent must have at least one section!');

                const parsedSections: AccentSection[] = [];

                for (const id of sectionKeys) {
                    const sectionContent = sections[id];

                    if (typeof sectionContent !== 'string')
                        throw new Error(
                            `Accent section "${id}" content must be a string!`,
                        );

                    if (!sectionContent.trim())
                        throw new Error(
                            `Accent section "${id}" content cannot be empty!`,
                        );

                    parsedSections.push({
                        id,
                        content: await this.parseBlocks(sectionContent),
                    });
                }

                if (
                    obj.direction &&
                    !['row', 'column'].includes(obj.direction)
                ) {
                    throw new Error(
                        'Accent sections direction must be either "row" or "column"!',
                    );
                }

                return {
                    type: 'complex',
                    objName: this.objName,
                    title: obj.title,
                    main: await this.parseBlocks(main),
                    direction: obj.direction,
                    sections: parsedSections,
                };
            }

            // Handle simple type with main
            return {
                type: 'simple',
                objName: this.objName,
                title: obj.title,
                main: await this.parseBlocks(main),
            };
        }

        if ('sections' in obj) {
            const sections = obj.sections;

            if (
                !sections ||
                typeof sections !== 'object' ||
                Array.isArray(sections)
            )
                throw new Error('Accent sections must be a regular object!');

            const sectionKeys = Object.keys(sections);

            if (sectionKeys.length === 0)
                throw new Error('Accent must have at least one section!');

            const parsedSections: AccentSection[] = [];

            for (const id of sectionKeys) {
                const sectionContent = sections[id];

                if (typeof sectionContent !== 'string')
                    throw new Error(
                        `Accent section "${id}" content must be a string!`,
                    );

                if (!sectionContent.trim())
                    throw new Error(
                        `Accent section "${id}" content cannot be empty!`,
                    );

                parsedSections.push({
                    id,
                    content: await this.parseBlocks(sectionContent),
                });
            }

            if (obj.direction && !['row', 'column'].includes(obj.direction)) {
                throw new Error(
                    'Accent sections direction must be either "row" or "column"!',
                );
            }

            return {
                type: 'complex',
                objName: this.objName,
                title: obj.title,
                direction: obj.direction,
                sections: parsedSections,
            };
        }

        throw new Error(
            'Accent element must have either "main" property or "sections" property!',
        );
    }
}

export class AccentStringifier extends ObjStringifyFactory<AccentSchema> {
    override objName!: string;

    override async createRawObject(): Promise<RawObject> {
        this.objName = this.payload().parseData.objName;

        const { parseData } = this.payload();
        const obj: RawObject = {};

        if (parseData.title) {
            obj.title = parseData.title;
        }

        if (parseData.type === 'simple') {
            obj.main = await this.stringify(parseData.main);
        } else if (parseData.type === 'complex') {
            if (parseData.main) {
                obj.main = await this.stringify(parseData.main);
            }

            if (parseData.direction) {
                obj.direction = parseData.direction;
            }

            const sections: Record<string, string> = {};
            for (const section of parseData.sections) {
                sections[section.id] = await this.stringify(section.content);
            }
            obj.sections = sections;
        }

        return obj;
    }
}
