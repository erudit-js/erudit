import { describe, expect, it } from 'vitest';

import { Problem } from '@src/elements/problem/problem';
import { eruditRawToProse } from '@src/rawToProse';
import { P } from '@src/elements/paragraph/core';
import { ProblemDescription } from '@src/elements/problem/problemContent';
import { defineProblemScript } from '@src/elements/problem/problemScript';

import { ProblemAnswer } from './problemContent.test';
import { Problems, SubProblem } from '@src/elements/problem/problems';

export const problemScript1 = defineProblemScript('script-1', {
  isGenerator: false,
})(() => (
  <>
    <ProblemDescription>Hello World!</ProblemDescription>
    <ProblemAnswer>
      <P>This is my answer!</P>
    </ProblemAnswer>
  </>
));

export const problemScript2 = defineProblemScript('script-2', {
  isGenerator: false,
})(() => (
  <>
    <ProblemDescription>Hello World!</ProblemDescription>
    <ProblemAnswer>
      <P>This is my answer!</P>
    </ProblemAnswer>
  </>
));

describe('rawToProseHook', () => {
  it('should add problem script files', async () => {
    const { problemScripts } = await eruditRawToProse(
      {},
      <>
        <Problem
          title="Script Problem"
          level="example"
          applied
          script={problemScript1()}
        />
        <P>Test Paragraph</P>
        <Problems title="Multiple Problems" level="hard">
          <P>Shared description</P>
          <SubProblem script={problemScript2()} />
        </Problems>
      </>,
    );

    expect(problemScripts.has('script-1')).toBe(true);
    expect(problemScripts.has('script-2')).toBe(true);
  });
});
