import {
    BlockNode,
    Node,
    type BlocksNode,
    type DefineElementSchema,
    type RenderDataGenerator,
} from '@bitran-js/core';

export const problemLevels = ['easy', 'medium', 'hard'] as const;

export type ProblemLevel = (typeof problemLevels)[number];

export function isProblemLevel(level: string): level is ProblemLevel {
    return problemLevels.includes(level as ProblemLevel);
}

export const problemAttributes = [
    'pretty',
    'applied',
    'method',
    'inter',
] as const;

export type ProblemAtrribute = (typeof problemAttributes)[number];

export function isProblemAttribute(
    attribute: string,
): attribute is ProblemAtrribute {
    return problemAttributes.includes(attribute as ProblemAtrribute);
}

export interface ProblemContentItem {
    source: string;
    blocks: BlocksNode;
}

export interface ProblemInfo {
    title: string;
    level: ProblemLevel;
    attributes?: ProblemAtrribute[];
}

export interface ProblemContent {
    generatorSrc?: string;
    description: ProblemContentItem;
    hints?: ProblemContentItem[];
    solution?: Record<string, ProblemContentItem>;
    answer?: ProblemContentItem;
    note?: ProblemContentItem;
}

export interface SetProblemContent extends ProblemContent {
    label?: string;
}

export interface SharedProblem {
    info: ProblemInfo;
}

export function getProblemContentNodes(content: ProblemContent) {
    const nodes: Node[] = [];

    nodes.push(content.description.blocks);

    if (content.hints) {
        nodes.push(...content.hints.map((hint) => hint.blocks));
    }

    if (content.solution) {
        nodes.push(...Object.values(content.solution).map((sol) => sol.blocks));
    }

    if (content.answer) {
        nodes.push(content.answer.blocks);
    }

    if (content.note) {
        nodes.push(content.note.blocks);
    }

    return nodes;
}

export const problemRenderDataKey = (generatorSrc?: string) => {
    if (generatorSrc === undefined) {
        return undefined;
    }

    return `${problemName}-generator:${generatorSrc}`;
};

export const problemRenderDataGenerator: RenderDataGenerator<ProblemSchema> = {
    createKey({ node }) {
        return problemRenderDataKey(node.parseData.generatorSrc);
    },
};

//
// Problem
//

export const problemName = 'problem';

export type ProblemParseData = SharedProblem & ProblemContent;
export interface ProblemRenderData {
    generatorContentPath?: string;
}

export type ProblemSchema = DefineElementSchema<{
    ParseData: ProblemParseData;
    RenderData: ProblemRenderData;
}>;

export class ProblemNode extends BlockNode<ProblemSchema> {
    override get children() {
        return getProblemContentNodes(this.parseData);
    }
}

//
// Problems
//

export const problemsName = 'problems';

export interface ProblemsParseData extends SharedProblem {
    shared?: BlocksNode;
    set: SetProblemContent[];
}

export interface ProblemsRenderData {
    generatorContentPaths: (string | undefined)[];
}

export type ProblemsSchema = DefineElementSchema<{
    ParseData: ProblemsParseData;
    RenderData: ProblemsRenderData;
}>;

export class ProblemsNode extends BlockNode<ProblemsSchema> {
    override get children() {
        const children: Node[] = [];

        if (this.parseData.shared) {
            children.push(this.parseData.shared);
        }

        for (const problem of this.parseData.set) {
            children.push(...getProblemContentNodes(problem));
        }

        return children;
    }
}
