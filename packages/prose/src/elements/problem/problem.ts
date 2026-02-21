import {
  defineSchema,
  type NoChildren,
  type RequiredChildren,
  type Schema,
  type Unique,
} from 'tsprose';

import {
  problemProps2Info,
  type ProblemInfo,
  type ProblemInfoProps,
} from './shared.js';
import {
  validateProblemContent,
  type ProblemContentChild,
} from './problemContent.js';
import { defineEruditTag } from '../../tag.js';
import {
  problemScriptStorageKey,
  type ProblemScriptStorage,
} from './storage.js';
import { type ProblemScriptInstance } from './problemScript.js';
import { EruditProseError } from '../../error.js';
import { defineProseCoreElement } from '../../coreElement.js';

export interface ProblemSchema extends Schema {
  name: 'problem';
  type: 'block';
  linkable: true;
  Data: ProblemData;
  Storage: ProblemScriptStorage;
  Children: ProblemContentChild[];
}

export interface ProblemData {
  info: ProblemInfo;
  scriptUniques?: Record<string, Unique>;
}

export const problemSchema = defineSchema<ProblemSchema>({
  name: 'problem',
  type: 'block',
  linkable: true,
});

export const Problem = defineEruditTag({
  tagName: 'Problem',
  schema: problemSchema,
})<
  ProblemInfoProps &
    (
      | ({ script?: undefined } & RequiredChildren)
      | ({ script: ProblemScriptInstance } & NoChildren)
    )
>(({ element, tagName, props, children }) => {
  const problemInfo = problemProps2Info(props);

  element.data = { info: problemInfo };
  element.title = problemInfo.title;

  if (children && props.script) {
    throw new EruditProseError(
      `<${tagName}> cannot have both script and children in Problem element!`,
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

export const problemCoreElement = defineProseCoreElement({
  schema: problemSchema,
  tags: [Problem],
});
