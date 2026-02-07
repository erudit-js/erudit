import {
  defineRegistryItem,
  defineSchema,
  ensureTagChildren,
  isRawElement,
  ProseError,
  type AnySchema,
  type NormalizedChildren,
  type TagChildren,
} from '@jsprose/core';

import { defineEruditTag } from '../../tag.js';
import { defineEruditProseCoreElement } from '../../coreElement.js';
import { uppercaseFirst, type UppercaseFirst } from '../../utils/case.js';
import type { EruditRawElement } from '../../rawElement.js';
import { tryParagraphWrap } from '../../shared/paragraphWrap.js';
import { problemCheckSchema } from './problemCheck.js';

/* --------------------------------------------------------- */
/* shared helpers                                            */
/* --------------------------------------------------------- */

function defineParagraphBlock<TName extends string>(opts: {
  name: TName;
  tagName: UppercaseFirst<TName>;
}) {
  const schema = defineSchema({
    name: opts.name,
    type: 'block',
    linkable: false,
  })<{
    Data: undefined;
    Storage: undefined;
    Children: AnySchema[];
  }>();

  const tag = defineEruditTag({
    tagName: opts.tagName,
    schema,
  })<TagChildren>(({ element, tagName, children }) => {
    ensureTagChildren(tagName, children);
    element.children = tryParagraphWrap(children) ?? children;
  });

  const registryItem = defineRegistryItem({ schema, tags: [tag] });
  const coreElement = defineEruditProseCoreElement({ registryItem });

  return { schema, tag, registryItem, coreElement };
}

/* --------------------------------------------------------- */
/* description / hint                                        */
/* --------------------------------------------------------- */

export const problemDescription = defineParagraphBlock({
  name: 'problemDescription',
  tagName: 'ProblemDescription',
});

export const problemHint = defineParagraphBlock({
  name: 'problemHint',
  tagName: 'ProblemHint',
});

export const {
  schema: problemDescriptionSchema,
  tag: ProblemDescription,
  registryItem: problemDescriptionRegistryItem,
  coreElement: problemDescriptionCoreElement,
} = problemDescription;

export const {
  schema: problemHintSchema,
  tag: ProblemHint,
  registryItem: problemHintRegistryItem,
  coreElement: problemHintCoreElement,
} = problemHint;

/* --------------------------------------------------------- */
/* section                                                   */
/* --------------------------------------------------------- */

export const problemSectionSchema = defineSchema({
  name: 'problemSection',
  type: 'block',
  linkable: false,
})<{
  Data: string;
  Storage: undefined;
  Children: AnySchema[];
}>();

export const ProblemSection = defineEruditTag({
  tagName: 'ProblemSection',
  schema: problemSectionSchema,
})<{ title: string } & TagChildren>(({ element, tagName, props, children }) => {
  ensureTagChildren(tagName, children);
  element.children = tryParagraphWrap(children) ?? children;

  const title = props.title.trim();
  if (!title) {
    throw new ProseError(`${tagName} title must be non-empty.`);
  }

  element.data = title;
});

export const problemSectionRegistryItem = defineRegistryItem({
  schema: problemSectionSchema,
  tags: [ProblemSection],
});

export const problemSectionCoreElement = defineEruditProseCoreElement({
  registryItem: problemSectionRegistryItem,
});

/* --------------------------------------------------------- */
/* section containers                                        */
/* --------------------------------------------------------- */

function defineProblemSectionContainer<T extends string>(name: T) {
  const cap = uppercaseFirst(name);
  const schemaName = `problem${cap}` as `problem${UppercaseFirst<T>}`;
  const tagName = `Problem${cap}` as `Problem${UppercaseFirst<T>}`;

  const schema = defineSchema({
    name: schemaName,
    type: 'block',
    linkable: false,
  })<{ Data: undefined; Storage: undefined; Children: AnySchema[] }>();

  const tag = defineEruditTag({ tagName, schema })<TagChildren>(({
    element,
    children,
  }) => {
    const head: EruditRawElement<AnySchema>[] = [];
    const sections: EruditRawElement<typeof problemSectionSchema>[] = [];

    let seenSection = false;

    for (const child of children!) {
      if (isRawElement(child, problemSectionSchema)) {
        seenSection = true;
        sections.push(child);
      } else {
        if (seenSection) {
          throw new ProseError(
            `${tagName}: non-section children must come before <ProblemSection>.`,
          );
        }
        head.push(child);
      }
    }

    element.children = [
      ...(tryParagraphWrap(head as NormalizedChildren) ?? head),
      ...sections,
    ];
  });

  const registryItem = defineRegistryItem({ schema, tags: [tag] });
  const coreElement = defineEruditProseCoreElement({ registryItem });

  return { schema, tag, registryItem, coreElement };
}

export const problemNote = defineProblemSectionContainer('note');
export const problemSolution = defineProblemSectionContainer('solution');
export const problemAnswer = defineProblemSectionContainer('answer');

/* --------------------------------------------------------- */
/* problem content validation                                */
/* --------------------------------------------------------- */

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
          throw new ProseError(
            `Invalid problem content at ${source}: only one <${label}> allowed.`,
          );
        }
        seen.add(label);
        break;
      }
    }
  }
}
