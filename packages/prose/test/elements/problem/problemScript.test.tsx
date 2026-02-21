import { describe, expect, it } from 'vitest';
import { defineUnique, isRawElement } from 'tsprose';

import { P } from '@src/elements/paragraph/core';
import {
  defineProblemScript,
  insertProblemScriptId,
} from '@src/elements/problem/problemScript';
import {
  ProblemDescription,
  problemDescriptionSchema,
} from '@src/elements/problem/problemContent';
import {
  ProblemCheck,
  problemCheckSchema,
} from '@src/elements/problem/problemCheck';

describe('Problem Script', () => {
  it('should throw when ID is not provided', () => {
    expect(() => {
      defineProblemScript({});
    }).toThrow();
  });

  const createUniqueP = () => {
    return defineUnique({
      documentId: 'doc1',
      name: 'myP',
      tag: P,
    });
  };

  it('should throw when incorrect problem content builder is provided', () => {
    const problemScript = defineProblemScript('script1/TestScript', {
      uniques: {
        myP: P,
      },
    })(({ uniques }) => {
      return (
        <>
          <P $={uniques.myP}>This is paragraph</P>
        </>
      );
    });

    expect(() =>
      problemScript({
        myP: createUniqueP(),
      }).generate(),
    ).toThrow(/\[Problem Script\]/);
  });

  it('should create problem script correctly', () => {
    const problemScript = defineProblemScript('script1/TestScript', {
      isGenerator: true,
      uniques: {
        myP: P,
      },
    })(({ uniques, initial, random }) => {
      return (
        <>
          <ProblemDescription>
            <P $={uniques.myP}>Problem Description</P>
          </ProblemDescription>
          <ProblemCheck answer={42} />
        </>
      );
    });

    const problemContent = problemScript({
      myP: createUniqueP(),
    }).generate(1337).problemContent;

    expect(problemContent).toHaveLength(2);
    expect(isRawElement(problemContent[0], problemDescriptionSchema)).toBe(
      true,
    );
    expect(isRawElement(problemContent[1], problemCheckSchema)).toBe(true);
  });

  it('should insert script ID correctly', () => {
    const code = `
export default defineProblemScript({
  foo: 1
});

export default defineProblemScript("already:here", {
  c: 3
});

export default defineProblemScript({ d: 4 });

export default defineProblemScript()(() => <></>);

        `.trim();

    const scriptSrc = 'myScriptSource';
    const transformedCode = insertProblemScriptId(scriptSrc, code);

    expect(transformedCode).toBe(
      `
export default defineProblemScript('myScriptSource',{
  foo: 1
});

export default defineProblemScript("already:here", {
  c: 3
});

export default defineProblemScript('myScriptSource',{ d: 4 });

export default defineProblemScript('myScriptSource')(() => <></>);
        `.trim(),
    );
  });

  it('should not throw when defining problem script without arg object', () => {
    expect(() => {
      defineProblemScript('scriptSrc/scriptName')(() => (
        <ProblemDescription>Description</ProblemDescription>
      ));
    }).not.toThrow();
  });
});
