import {
    ObjBlockParseFactory,
    ObjStringifyFactory,
    ParseFactory,
    StringifyFactory,
    type PlainObject,
} from '@bitran-js/transpiler';

import {
    isProblemAttribute,
    isProblemLevel,
    problemLevels,
    problemName,
    problemsName,
    type ProblemContent,
    type ProblemInfo,
    type ProblemParseData,
    type ProblemSchema,
    type ProblemsParseData,
    type ProblemsSchema,
} from './shared';

export function parseProblemInfo(obj: PlainObject): ProblemInfo {
    if (!obj.title) {
        throw new Error(`Problem element must have "title" property!`);
    }

    if (!isProblemLevel(obj.level)) {
        throw new Error(
            `Problem element "level" property must be one of: ${problemLevels.join(
                ', ',
            )}!`,
        );
    }

    if (obj.attributes) {
        if (!Array.isArray(obj.attributes)) {
            throw new Error(
                `Problem element "attributes" property must be an array!`,
            );
        }

        const invalidAttributes = obj.attributes.filter(
            (attr) => !isProblemAttribute(attr),
        );

        if (invalidAttributes.length > 0) {
            throw new Error(
                `Problem element "attributes" property contains invalid attributes: ${JSON.stringify(invalidAttributes)}!`,
            );
        }
    }

    return {
        title: obj.title,
        level: obj.level,
        attributes: obj.attributes,
    };
}

export async function parseProblemContent(
    obj: PlainObject,
    parseFactory: ParseFactory,
): Promise<ProblemContent> {
    const isValidBitranCode = (target: any) => {
        return typeof target === 'string' && !!target;
    };

    const throwNotValidBitranCode = (name: string) => {
        throw new Error(
            `Problem content "${name}" property must be a non-empty string!`,
        );
    };

    if (!isValidBitranCode(obj.description)) {
        throwNotValidBitranCode('description');
    }

    const description = await parseFactory.parseBlocks(obj.description);

    const content: ProblemContent = {
        description: {
            source: obj.description,
            blocks: description,
        },
    };

    for (const name of ['answer', 'note'] as const) {
        if (!obj[name]) {
            continue;
        }

        if (!isValidBitranCode(obj[name])) {
            throwNotValidBitranCode(name);
        }

        content[name] = {
            source: obj[name],
            blocks: await parseFactory.parseBlocks(obj[name]),
        };
    }

    if (obj.hints) {
        if (!Array.isArray(obj.hints)) {
            throw new Error(
                `Problem content "hints" property must be an array!`,
            );
        }
        content.hints = [];
        for (const [index, hint] of obj.hints.entries()) {
            if (!isValidBitranCode(hint)) {
                throw new Error(
                    `Hint ${index + 1} must be a non-empty string!`,
                );
            }

            content.hints.push({
                source: hint,
                blocks: await parseFactory.parseBlocks(hint),
            });
        }
    }

    // Add support for single hint property
    if (obj.hint) {
        if (obj.hints) {
            throw new Error(
                `Problem content cannot have both "hint" and "hints" properties!`,
            );
        }

        if (!isValidBitranCode(obj.hint)) {
            throw new Error(
                `Problem content "hint" property must be a non-empty string!`,
            );
        }

        content.hints = [
            {
                source: obj.hint,
                blocks: await parseFactory.parseBlocks(obj.hint),
            },
        ];
    }

    if (obj.solution) {
        if (typeof obj.solution === 'string') {
            if (!isValidBitranCode(obj.solution)) {
                throw new Error(
                    `Problem content "solution" property must be a non-empty string or an object!`,
                );
            }

            content.solution = {
                '': {
                    source: obj.solution,
                    blocks: await parseFactory.parseBlocks(obj.solution),
                },
            };
        } else if (typeof obj.solution === 'object') {
            content.solution = {};

            for (const [key, value] of Object.entries(
                obj.solution as Record<string, string>,
            )) {
                if (!isValidBitranCode(value)) {
                    throw new Error(
                        `Solution section "${key}" must be a non-empty string!`,
                    );
                }

                content.solution[key] = {
                    source: value,
                    blocks: await parseFactory.parseBlocks(value),
                };
            }
        } else {
            throw new Error(
                `Problem content "solution" property must be a string or an object!`,
            );
        }
    }

    if (obj.generator) {
        if (typeof obj.generator !== 'string') {
            throw new Error(
                `Problem content "generator" property must be a string!`,
            );
        }
        content.generatorSrc = obj.generator;
    }

    return content;
}

export function problemContentToStrData(content: ProblemContent): PlainObject {
    const result: PlainObject = {
        generator: content.generatorSrc,
        description: content.description.source,
    };

    if (content.hints) {
        if (content.hints.length === 1) {
            result.hint = content.hints[0]!.source;
        } else {
            result.hints = content.hints.map((hint) => hint.source);
        }
    }

    if (content.solution) {
        if (
            Object.keys(content.solution).length === 1 &&
            content.solution['']
        ) {
            result.solution = content.solution[''].source;
        } else {
            result.solution = {};

            for (const [key, value] of Object.entries(content.solution)) {
                result.solution[key] = value.source;
            }
        }
    }

    if (content.answer) {
        result.answer = content.answer.source;
    }

    if (content.note) {
        result.note = content.note.source;
    }

    return result;
}

//
// Problem
//

export class ProblemParser extends ObjBlockParseFactory<ProblemSchema> {
    override objName = problemName;

    override async parseDataFromObj(
        obj: PlainObject,
    ): Promise<ProblemParseData> {
        const info = parseProblemInfo(obj);
        const content = await parseProblemContent(obj, this);

        return {
            info,
            ...content,
        };
    }
}

export class ProblemStringifier extends ObjStringifyFactory<ProblemSchema> {
    override objName = problemName;

    override async createStrData(): Promise<PlainObject> {
        const { parseData } = this.payload();
        return {
            ...parseData.info,
            ...problemContentToStrData(parseData),
        };
    }
}

//
// Problems
//

export class ProblemsParser extends ObjBlockParseFactory<ProblemsSchema> {
    override objName = problemsName;

    override async parseDataFromObj(
        obj: PlainObject,
    ): Promise<ProblemsParseData> {
        const info = parseProblemInfo(obj);

        if (!Array.isArray(obj.set) || obj.set.length === 0) {
            throw new Error(
                `Problems element "set" property must be a non-empty an array!`,
            );
        }

        const set: ProblemContent[] = [];

        for (const [index, problemContent] of obj.set.entries()) {
            try {
                set.push(await parseProblemContent(problemContent, this));
            } catch (error: any) {
                throw new Error(
                    `Error parsing problem content item ${index + 1}: ${error.message}`,
                );
            }
        }

        const result: ProblemsParseData = {
            info,
            set,
        };

        if (obj.shared) {
            if (typeof obj.shared === 'string' && !!obj.shared) {
                result.shared = await this.parseBlocks(obj.shared);
            }
        }

        return result;
    }
}

export class ProblemsStringifier extends ObjStringifyFactory<ProblemsSchema> {
    override objName = problemsName;

    override async createStrData(): Promise<PlainObject> {
        const { parseData } = this.payload();
        const result: PlainObject = {
            title: parseData.info.title,
            level: parseData.info.level,
            attributes: parseData.info.attributes,
            shared: parseData.shared
                ? await this.stringify(parseData.shared)
                : undefined,
            set: [],
        };

        for (const problem of parseData.set) {
            const problemObj = problemContentToStrData(problem);
            result.set.push(problemObj);
        }

        return result;
    }
}
