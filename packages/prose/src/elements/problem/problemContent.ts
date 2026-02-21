import {
  defineSchema,
  ensureTagBlockChildren,
  ensureTagChildren,
  isRawBlock,
  isRawElement,
  type BlockRawElement,
  type BlockSchema,
  type NormalizedChildren,
  type Schema,
} from 'tsprose';

import { defineEruditTag } from '../../tag.js';
import { uppercaseFirst, type UppercaseFirst } from '../../utils/case.js';
import type { EruditRawElement, ToEruditRawElement } from '../../rawElement.js';
import { paragraphWrap } from '../../shared/paragraphWrap.js';
import { problemCheckSchema } from './problemCheck.js';
import { defineProseCoreElement } from '../../coreElement.js';
import { EruditProseError } from '../../error.js';

function toBlockChildren(
  tagName: string,
  children: NormalizedChildren,
): BlockRawElement[] {
  const wrap = paragraphWrap(children);
  if (wrap) {
    return wrap;
  }

  ensureTagBlockChildren(tagName, children);
  return children;
}

//
// Problem Description
//

export interface ProblemDescriptionSchema extends Schema {
  name: 'problemDescription';
  type: 'block';
  linkable: false;
  Data: undefined;
  Storage: undefined;
  Children: BlockSchema[];
}

export const problemDescriptionSchema = defineSchema<ProblemDescriptionSchema>({
  name: 'problemDescription',
  type: 'block',
  linkable: false,
});

export const ProblemDescription = defineEruditTag({
  schema: problemDescriptionSchema,
  tagName: 'ProblemDescription',
})(({ element, tagName, children }) => {
  element.children = toBlockChildren(tagName, children);
});

export const problemDescriptionCoreElement = defineProseCoreElement({
  schema: problemDescriptionSchema,
  tags: [ProblemDescription],
});

//
// Problem Hint
//

export interface ProblemHintSchema extends Schema {
  name: 'problemHint';
  type: 'block';
  linkable: false;
  Data: undefined;
  Storage: undefined;
  Children: BlockSchema[];
}

export const problemHintSchema = defineSchema<ProblemHintSchema>({
  name: 'problemHint',
  type: 'block',
  linkable: false,
});

export const ProblemHint = defineEruditTag({
  schema: problemHintSchema,
  tagName: 'ProblemHint',
})(({ element, tagName, children }) => {
  element.children = toBlockChildren(tagName, children);
});

export const problemHintCoreElement = defineProseCoreElement({
  schema: problemHintSchema,
  tags: [ProblemHint],
});

//
// Problem Section
//

export interface ProblemSectionSchema extends Schema {
  name: 'problemSection';
  type: 'block';
  linkable: false;
  Data: string;
  Storage: undefined;
  Children: BlockSchema[];
}

export const problemSectionSchema = defineSchema<ProblemSectionSchema>({
  name: 'problemSection',
  type: 'block',
  linkable: false,
});

export const ProblemSection = defineEruditTag({
  tagName: 'ProblemSection',
  schema: problemSectionSchema,
})<{ title: string }>(({ element, tagName, props, children }) => {
  element.children = toBlockChildren(tagName, children);

  const title = props.title.trim();
  if (!title) {
    throw new EruditProseError(`${tagName} title must be non-empty.`);
  }

  element.data = title;
});

export const problemSectionCoreElement = defineProseCoreElement({
  schema: problemSectionSchema,
  tags: [ProblemSection],
});

//
// Problem Note, Solution, Answer
//

export interface SectionContainerSchema<
  ContainerName extends string,
> extends Schema {
  name: `problem${UppercaseFirst<ContainerName>}`;
  type: 'block';
  linkable: false;
  Data: undefined;
  Storage: undefined;
  Children: BlockSchema[];
}

function defineProblemSectionContainer<ContainerName extends string>(
  name: ContainerName,
) {
  const cap = uppercaseFirst(name);
  const schemaName =
    `problem${cap}` as `problem${UppercaseFirst<ContainerName>}`;
  const tagName = `Problem${cap}` as `Problem${UppercaseFirst<ContainerName>}`;

  const schema = defineSchema<SectionContainerSchema<ContainerName>>({
    name: schemaName,
    type: 'block',
    linkable: false,
  });

  const tag = defineEruditTag({ tagName, schema })(({ element, children }) => {
    const head: ToEruditRawElement<BlockSchema>[] = [];
    const sections: ToEruditRawElement<ProblemSectionSchema>[] = [];

    let seenSection = false;

    for (const child of children!) {
      if (isRawElement(child, problemSectionSchema)) {
        seenSection = true;
        sections.push(child);
      } else {
        if (!isRawBlock(child)) {
          throw new EruditProseError(
            `${tagName} cannot have inline children (found "${child.schema.name}").`,
          );
        }
        if (seenSection) {
          throw new EruditProseError(
            `${tagName}: non-section children must come before <ProblemSection>.`,
          );
        }
        head.push(child);
      }
    }

    element.children = [...head, ...sections];
  });

  const coreElement = defineProseCoreElement({
    schema,
    tags: [tag],
  });

  return { schema, tag, coreElement };
}

export const problemNote = defineProblemSectionContainer('note');
export const problemSolution = defineProblemSectionContainer('solution');
export const problemAnswer = defineProblemSectionContainer('answer');

//
// Problem Content Validation
//

export type ProblemContentChild =
  | typeof problemDescriptionSchema
  | typeof problemHintSchema
  | typeof problemNote.schema
  | typeof problemSolution.schema
  | typeof problemAnswer.schema
  | typeof problemCheckSchema;

export function validateProblemContent(
  source: string,
  children: NormalizedChildren,
) {
  ensureTagChildren(source, children, [
    problemDescriptionSchema,
    problemHintSchema,
    problemNote.schema,
    problemSolution.schema,
    problemAnswer.schema,
    problemCheckSchema,
  ]);

  const uniques = [
    { schema: problemDescriptionSchema, label: 'ProblemDescription' },
    { schema: problemSolution.schema, label: 'ProblemSolution' },
    { schema: problemAnswer.schema, label: 'ProblemAnswer' },
  ] as const;

  const seen = new Set<string>();

  for (const child of children) {
    for (const { schema, label } of uniques) {
      if (isRawElement(child, schema)) {
        if (seen.has(label)) {
          throw new EruditProseError(
            `Invalid problem content at ${source}: only one <${label}> allowed.`,
          );
        }
        seen.add(label);
        break;
      }
    }
  }
}
