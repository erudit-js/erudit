import type { XOR } from 'ts-xor';
import {
  defineSchema,
  ensureTagChildren,
  type OptionalChildren,
  type Schema,
} from 'tsprose';

import { defineEruditTag } from '../../tag.js';
import { defineProseCoreElement } from '../../coreElement.js';
import { EruditProseError } from '../../error.js';

//
// Prose Element
//

export interface ProblemCheckInfo {
  label?: string;
  hint?: string;
  placeholder?: string;
}

export type ProblemCheckData = ProblemCheckInfo & { serializedValidator: any };

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
  { label?: string; hint?: string; placeholder?: string } & XOR<
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
    { script: string }
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
    validator = {
      type: 'value',
      answer: props.answer,
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
      name: props.script,
    };
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

export interface ProblemCheckValidatorBoolean {
  type: 'boolean';
  answer: boolean;
}

export type ProblemCheckValue = undefined | number | string | RegExp;
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

export type ProblemCheckValidator =
  | ProblemCheckValidatorBoolean
  | ProblemCheckValidatorValue
  | ProblemCheckValidatorArray
  | ProblemCheckValidatorScript;

export function toSerializableValidator(validator: ProblemCheckValidator) {
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

  throw new Error(
    `Unknown ProblemCheckData type "${(validator as any).type}"!`,
  );
}

export function fromSerializableValidator(
  serializedValidator: any,
): ProblemCheckValidator {
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

  throw new Error(
    `Unknown ProblemCheckData type "${serializedValidator.type}"!`,
  );
}

export function checkProblemAnswer(
  answer: string,
  yesRegexp: RegExp,
  noRegexp: RegExp,
  validator: ProblemCheckValidator,
): boolean {
  if (validator.type === 'boolean') {
    return validator.answer === true
      ? yesRegexp.test(answer)
      : noRegexp.test(answer);
  }

  const checkDefinedAnswer = (
    expected: ProblemCheckValueDefined,
    answer: string,
  ): boolean => {
    if (typeof expected === 'number') {
      return Number(answer) === expected;
    }

    if (expected instanceof RegExp) {
      return expected.test(answer);
    }

    return answer === String(expected);
  };

  const checkAnswer = (expect: ProblemCheckValue, answer: string): boolean => {
    if (expect === undefined || expect === null) {
      return answer.trim() === '';
    }

    return checkDefinedAnswer(expect, answer);
  };

  if (validator.type === 'value') {
    const anyOf = Array.isArray(validator.answer)
      ? validator.answer
      : [validator.answer];
    return anyOf.some((expect) => checkAnswer(expect, answer));
  }

  if (validator.type === 'array') {
    const separatorRegexp = new RegExp(
      `\\s*${validator.separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`,
      'g',
    );

    const parts = answer.split(separatorRegexp).map((p) => p.trim());

    const checkExpected = (
      expected: ProblemCheckValueDefined | ProblemCheckValueDefined[],
      actual: string,
    ): boolean => {
      if (Array.isArray(expected)) {
        // any-of logic
        return expected.some((e) => checkDefinedAnswer(e, actual));
      }
      return checkDefinedAnswer(expected, actual);
    };

    if (parts.length !== validator.answers.length) {
      return false;
    }

    if (validator.ordered) {
      return validator.answers.every((expected, i) =>
        checkExpected(expected, parts[i]),
      );
    }

    // unordered matching (multiset semantics)
    const remaining = [...parts];

    for (const expected of validator.answers) {
      const index = remaining.findIndex((actual) =>
        checkExpected(expected, actual),
      );

      if (index === -1) {
        return false;
      }

      remaining.splice(index, 1);
    }

    return true;
  }

  throw new EruditProseError(
    `"checkProblemAnswer" not implemented for type "${(validator as any).type}"!`,
  );
}
