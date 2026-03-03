import {
  defineSchema,
  ensureTagBlockChildren,
  isRawElement,
  type BlockRawElement,
  type BlockSchema,
  type Schema,
  type ToRawElement,
  type Unique,
} from 'tsprose';

import {
  validateProblemContent,
  type ProblemContentChild,
} from './problemContent.js';
import { defineEruditTag } from '../../tag.js';
import {
  problemProps2Info,
  type ProblemInfo,
  type ProblemInfoProps,
} from './shared.js';
import {
  problemScriptStorageKey,
  type ProblemScriptStorage,
} from './storage.js';
import { type ProblemScriptInstance } from './problemScript.js';
import { EruditProseError } from '../../error.js';
import { defineProseCoreElement } from '../../coreElement.js';

//
// SubProblem
//

export interface SubProblemSchema extends Schema {
  name: 'subProblem';
  type: 'block';
  linkable: false;
  Data: SubProblemData;
  Storage: ProblemScriptStorage;
  Children: ProblemContentChild[];
}

export interface SubProblemData {
  label?: string;
  standalone?: true;
  scriptUniques?: Record<string, Unique>;
}

export const subProblemSchema = defineSchema<SubProblemSchema>({
  name: 'subProblem',
  type: 'block',
  linkable: false,
});

export const SubProblem = defineEruditTag({
  tagName: 'SubProblem',
  schema: subProblemSchema,
})<
  { label?: string; standalone?: true } & (
    | { children: {}; script?: undefined }
    | { script: ProblemScriptInstance; children?: undefined }
  )
>(({ element, tagName, props, children }) => {
  element.data = {};

  const label = props.label?.trim();
  if (label) {
    element.data.label = label;
  }

  if (props.standalone) {
    element.data.standalone = true;
  }

  if (props.script && children) {
    throw new EruditProseError(
      `<${tagName}> cannot have both script and children!`,
    );
  }

  if (props.script) {
    element.data.scriptUniques = props.script.uniques;

    element.storageKey = problemScriptStorageKey(props.script.scriptSrc);

    element.children = props.script.generate().problemContent;
  } else {
    validateProblemContent(tagName, children);
    element.children = children as any;
  }
});

export const subProblemCoreElement = defineProseCoreElement({
  schema: subProblemSchema,
  tags: [SubProblem],
});

//
// Problems
//

export interface ProblemsSchema extends Schema {
  name: 'problems';
  type: 'block';
  linkable: true;
  Data: ProblemInfo;
  Storage: undefined;
  Children: (SubProblemSchema | BlockSchema)[];
}

export const problemsSchema = defineSchema<ProblemsSchema>({
  name: 'problems',
  type: 'block',
  linkable: true,
});

export const Problems = defineEruditTag({
  tagName: 'Problems',
  schema: problemsSchema,
})<ProblemInfoProps>(({ element, tagName, props, children }) => {
  ensureTagBlockChildren(tagName, children);

  const subProblemChildren: ToRawElement<SubProblemSchema>[] = [];
  const otherChildren: BlockRawElement[] = [];

  for (const child of children) {
    if (isRawElement(child, subProblemSchema)) {
      subProblemChildren.push(child);
    } else {
      otherChildren.push(child);
    }
  }

  if (subProblemChildren.length === 0) {
    throw new EruditProseError(
      `<${tagName}> must have at least one <SubProblem> child!`,
    );
  }

  element.children = [...otherChildren, ...subProblemChildren];
  const problemInfo = problemProps2Info(props);
  element.data = problemInfo;
  element.title = problemInfo.title;
});

export const problemsCoreElement = defineProseCoreElement({
  schema: problemsSchema,
  tags: [Problems],
});
