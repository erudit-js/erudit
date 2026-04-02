import type { XOR } from 'ts-xor';
import {
  defineSchema,
  ensureTagChildren,
  type OptionalChildren,
  type RawElement,
  type Schema,
} from 'tsprose';
import {
  isProblemCheckObject,
  type ProblemCheckObject,
  type ProblemCheckers,
} from '@erudit-js/core/problemCheck';

import { defineEruditTag } from '../../tag.js';
import { defineProseCoreElement } from '../../coreElement.js';
import { EruditProseError } from '../../error.js';
import { P } from '../paragraph/core.js';

//
// Prose Element
//

export interface ProblemCheckInfo {
  label?: string;
  hint?: string;
  placeholder?: string;
  expand?: true;
}

export type ProblemCheckData = ProblemCheckInfo & {
  serializedValidator: any;
  ensureStorage?: RawElement[];
};

export interface ProblemCheckSchema extends Schema {
  name: 'problemCheck';
  type: 'block';
  linkable: false;
  Data: ProblemCheckData;
  Storage: undefined;
  Children: ProblemCheckSchema[] | undefined;
}

export const problemCheckSchema = defineSchema<ProblemCheckSchema>({
  name: 'problemCheck',
  type: 'block',
  linkable: false,
});

export const ProblemCheck = defineEruditTag({
  tagName: 'ProblemCheck',
  schema: problemCheckSchema,
})<
  { label?: string; hint?: string; placeholder?: string; expand?: true } & XOR<
    { yes: true },
    { no: true },
    { boolean: boolean },
    { answer: ProblemCheckValue | ProblemCheckValue[] },
    {
      answers:
        | (ProblemCheckValueDefined | ProblemCheckValueDefined[])[]
        | {
            ordered?: boolean;
            separator?: string;
            values: (ProblemCheckValueDefined | ProblemCheckValueDefined[])[];
          };
    },
    { script: string },
    {
      select: ProblemCheckSelectOptionProp[];
      multiple?: boolean;
      columns?: number;
    }
  > &
    OptionalChildren
>(({ element, tagName, props, children }) => {
  //
  // Info
  //

  const checkInfo: ProblemCheckInfo = {
    label: props.label,
    hint: props.hint,
    placeholder: props.placeholder,
    ...(props.expand ? { expand: true } : {}),
  };

  //
  // Children
  //

  if (children && children.length > 0) {
    ensureTagChildren(tagName, children, problemCheckSchema);
    element.children = children;
  }

  //
  // Validator
  //

  let validator: ProblemCheckValidator | undefined;

  if ('yes' in props) {
    validator = {
      type: 'boolean',
      answer: true,
    };
  } else if ('no' in props) {
    validator = {
      type: 'boolean',
      answer: false,
    };
  } else if ('boolean' in props) {
    validator = {
      type: 'boolean',
      answer: !!props.boolean,
    };
  } else if ('answer' in props) {
    const answerProp = props.answer;

    if (!Array.isArray(answerProp) && isProblemCheckObject(answerProp)) {
      element.data = {
        ...checkInfo,
        serializedValidator: answerProp,
      };
      return;
    }

    validator = {
      type: 'value',
      answer: answerProp,
    };
  } else if ('answers' in props) {
    const answersProp = props.answers!;
    let ordered = false;
    let separator = ',';
    let answers: (ProblemCheckValueDefined | ProblemCheckValueDefined[])[];

    if (Array.isArray(answersProp)) {
      answers = answersProp;
    } else {
      ordered = answersProp.ordered ?? false;
      separator = answersProp.separator ?? ',';
      answers = answersProp.values;
    }

    validator = {
      type: 'array',
      ordered,
      separator,
      answers,
    };
  } else if ('script' in props) {
    validator = {
      type: 'script',
      name: props.script!,
    };
  } else if ('select' in props) {
    const selectOptions = props.select;
    const ensureStorageElements: RawElement[] = [];

    const options: ProblemCheckSelectOption[] = selectOptions.map((opt) => {
      let contentArray: any[];

      if (typeof opt.content === 'string') {
        contentArray = [P({ children: opt.content })];
      } else {
        contentArray = Array.isArray(opt.content) ? opt.content : [opt.content];
      }

      // Collect raw elements that may need storage
      for (const rawEl of contentArray) {
        if (rawEl && typeof rawEl === 'object') {
          ensureStorageElements.push(rawEl as RawElement);
        }
      }

      return {
        content: contentArray,
        ...(opt.answer === true ? { answer: true as const } : {}),
      };
    });

    validator = {
      type: 'select',
      multiple: props.multiple ?? false,
      columns: props.columns,
      options,
    };

    element.data = {
      ...checkInfo,
      serializedValidator: toSerializableValidator(validator),
    };

    if (ensureStorageElements.length > 0) {
      element.data.ensureStorage = ensureStorageElements;
    }

    return;
  }

  element.data = {
    ...checkInfo,
    serializedValidator: toSerializableValidator(validator!),
  };
});

export const problemCheckCoreElement = defineProseCoreElement({
  schema: problemCheckSchema,
  tags: [ProblemCheck],
});

//
// ProblemCheck Data
//

export {
  type ProblemCheckObject,
  isProblemCheckObject,
  type ProblemCheckers,
} from '@erudit-js/core/problemCheck';

export interface ProblemCheckValidatorBoolean {
  type: 'boolean';
  answer: boolean;
}

export type ProblemCheckValue =
  | undefined
  | number
  | string
  | RegExp
  | ProblemCheckObject;
export type ProblemCheckValueDefined = Exclude<ProblemCheckValue, undefined>;

export interface ProblemCheckValidatorValue {
  type: 'value';
  answer: ProblemCheckValue | ProblemCheckValue[];
}

export interface ProblemCheckValidatorArray {
  type: 'array';
  ordered: boolean;
  separator: string;
  answers: (ProblemCheckValueDefined | ProblemCheckValueDefined[])[];
}

export interface ProblemCheckValidatorScript {
  type: 'script';
  name: string;
}

export interface ProblemCheckSelectOptionProp {
  content: string | RawElement | RawElement[];
  answer?: boolean;
}

export interface ProblemCheckSelectOption {
  content: any[];
  answer?: true;
}

export interface ProblemCheckValidatorSelect {
  type: 'select';
  multiple: boolean;
  columns?: number;
  options: ProblemCheckSelectOption[];
}

export type ProblemCheckValidator =
  | ProblemCheckValidatorBoolean
  | ProblemCheckValidatorValue
  | ProblemCheckValidatorArray
  | ProblemCheckValidatorScript
  | ProblemCheckValidatorSelect;

export function toSerializableValidator(validator: ProblemCheckValidator) {
  if ((validator as any).__ERUDIT_CHECK === true) {
    return validator;
  }

  if (validator.type === 'boolean') {
    return validator;
  }

  const toSerializableValue = (value: ProblemCheckValue) => {
    if (value instanceof RegExp) {
      return {
        type: 'regexp',
        source: value.source,
        flags: value.flags,
      } as const;
    }

    return value;
  };

  if (validator.type === 'value') {
    return {
      type: 'value',
      answer: Array.isArray(validator.answer)
        ? validator.answer.map(toSerializableValue)
        : toSerializableValue(validator.answer),
    };
  }

  if (validator.type === 'array') {
    return {
      type: 'array',
      ordered: validator.ordered,
      separator: validator.separator,
      answers: validator.answers.map((answer) => {
        if (Array.isArray(answer)) {
          return answer.map(toSerializableValue);
        }
        return toSerializableValue(answer);
      }),
    };
  }

  if (validator.type === 'script') {
    return validator;
  }

  if (validator.type === 'select') {
    return {
      type: 'select',
      multiple: validator.multiple,
      columns: validator.columns,
      options: validator.options.map((opt) => ({
        content: opt.content,
        ...(opt.answer !== undefined ? { answer: opt.answer } : {}),
      })),
    };
  }

  throw new Error(
    `Unknown ProblemCheckData type "${(validator as any).type}"!`,
  );
}

export function fromSerializableValidator(
  serializedValidator: any,
): ProblemCheckValidator | ProblemCheckObject {
  if (serializedValidator.__ERUDIT_CHECK === true) {
    return serializedValidator as ProblemCheckObject;
  }

  if (serializedValidator.type === 'boolean') {
    return serializedValidator as ProblemCheckValidatorBoolean;
  }

  const fromSerializableValue = (value: any): ProblemCheckValue => {
    if (value && value.type === 'regexp') {
      return new RegExp(value.source, value.flags);
    }

    return value;
  };

  if (serializedValidator.type === 'value') {
    return {
      type: 'value',
      answer: Array.isArray(serializedValidator.answer)
        ? serializedValidator.answer.map(fromSerializableValue)
        : fromSerializableValue(serializedValidator.answer),
    } as ProblemCheckValidatorValue;
  }

  if (serializedValidator.type === 'array') {
    return {
      type: 'array',
      ordered: serializedValidator.ordered,
      separator: serializedValidator.separator,
      answers: serializedValidator.answers.map((answer: any) => {
        if (Array.isArray(answer)) {
          return answer.map(fromSerializableValue);
        }
        return fromSerializableValue(answer);
      }),
    } as ProblemCheckValidatorArray;
  }

  if (serializedValidator.type === 'script') {
    return serializedValidator as ProblemCheckValidatorScript;
  }

  if (serializedValidator.type === 'select') {
    return {
      type: 'select',
      multiple: serializedValidator.multiple,
      columns: serializedValidator.columns,
      options: serializedValidator.options.map((opt: any) => ({
        content: opt.content,
        ...(opt.answer !== undefined ? { answer: opt.answer } : {}),
      })),
    } as ProblemCheckValidatorSelect;
  }

  throw new Error(
    `Unknown ProblemCheckData type "${serializedValidator.type}"!`,
  );
}

export interface ProblemCheckContext {
  yesRegexp: RegExp;
  noRegexp: RegExp;
  checkers: ProblemCheckers;
}

export async function checkProblemAnswer(
  answer: string,
  against: ProblemCheckValidator | ProblemCheckObject,
  context: ProblemCheckContext,
): Promise<boolean> {
  if (isProblemCheckObject(against)) {
    const checker = context.checkers[against.name];
    if (!checker) {
      console.warn(`No problem checker found for "${against.name}"`);
      return false;
    }
    return await checker.check(against.data, answer);
  }

  if (against.type === 'boolean') {
    return against.answer === true
      ? context.yesRegexp.test(answer)
      : context.noRegexp.test(answer);
  }

  const checkDefinedAnswer = async (
    expected: ProblemCheckValueDefined,
    answer: string,
  ): Promise<boolean> => {
    if (isProblemCheckObject(expected)) {
      const checker = context.checkers[expected.name];
      if (!checker) {
        console.warn(`No problem checker found for "${expected.name}"`);
        return false;
      }
      return await checker.check(expected.data, answer);
    }

    if (typeof expected === 'number') {
      return Number(answer) === expected;
    }

    if (expected instanceof RegExp) {
      return expected.test(answer);
    }

    return answer === String(expected);
  };

  const checkAnswer = async (
    expect: ProblemCheckValue,
    answer: string,
  ): Promise<boolean> => {
    if (expect === undefined || expect === null) {
      return answer.trim() === '';
    }

    return checkDefinedAnswer(expect, answer);
  };

  if (against.type === 'value') {
    const anyOf = Array.isArray(against.answer)
      ? against.answer
      : [against.answer];
    const results = await Promise.all(
      anyOf.map((expect) => checkAnswer(expect, answer)),
    );
    return results.some(Boolean);
  }

  if (against.type === 'array') {
    const separatorRegexp = new RegExp(
      `\\s*${against.separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`,
      'g',
    );

    const parts = answer.split(separatorRegexp).map((p) => p.trim());

    const checkExpected = async (
      expected: ProblemCheckValueDefined | ProblemCheckValueDefined[],
      actual: string,
    ): Promise<boolean> => {
      if (Array.isArray(expected)) {
        const results = await Promise.all(
          expected.map((e) => checkDefinedAnswer(e, actual)),
        );
        return results.some(Boolean);
      }
      return checkDefinedAnswer(expected, actual);
    };

    if (parts.length !== against.answers.length) {
      return false;
    }

    if (against.ordered) {
      const results = await Promise.all(
        against.answers.map((expected, i) => checkExpected(expected, parts[i])),
      );
      return results.every(Boolean);
    }

    // unordered matching (multiset semantics)
    const remaining = [...parts];

    for (const expected of against.answers) {
      let foundIndex = -1;
      for (let i = 0; i < remaining.length; i++) {
        if (await checkExpected(expected, remaining[i])) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex === -1) {
        return false;
      }

      remaining.splice(foundIndex, 1);
    }

    return true;
  }

  if (against.type === 'select') {
    // answer is a comma-separated list of selected option indices
    const selectedIndices = answer
      ? answer.split(',').map((s) => Number(s.trim()))
      : [];

    // Determine which options are "correct" (have an answer field defined)
    const correctIndices = against.options
      .map((opt, i) => (opt.answer !== undefined ? i : -1))
      .filter((i) => i !== -1);

    if (correctIndices.length === 0) {
      // No correct options defined — correct answer is selecting nothing
      return selectedIndices.length === 0;
    }

    // Check selected matches correct exactly
    const selectedSet = new Set(selectedIndices);
    const correctSet = new Set(correctIndices);

    if (selectedSet.size !== correctSet.size) {
      return false;
    }

    for (const idx of selectedSet) {
      if (!correctSet.has(idx)) {
        return false;
      }
    }

    return true;
  }

  throw new EruditProseError(
    `"checkProblemAnswer" not implemented for type "${(against as any).type}"!`,
  );
}
