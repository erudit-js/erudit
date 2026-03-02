//
// Problem Check Definition
//

export type ToProblemCheckDefinition<Name extends string, Data extends any> = {
  name: Name;
  Data: Data;
};

export type ProblemCheckDefinition = ToProblemCheckDefinition<string, any>;

export function defineProblemCheck<Name extends string>(name: Name) {
  function finalizeProblemCheck<Data>() {
    return {
      name,
    } satisfies Omit<
      ProblemCheckDefinition,
      'Data'
    > as ToProblemCheckDefinition<Name, Data>;
  }

  return finalizeProblemCheck;
}

//
// Problem Check Object
//

export const ERUDIT_CHECK_PREFIX = '__ERUDIT_CHECK';

export type ToProblemCheckObject<Definition extends ProblemCheckDefinition> = {
  [ERUDIT_CHECK_PREFIX]: true;
  name: Definition['name'];
  data: Definition['Data'];
};

export type ProblemCheckObject = ToProblemCheckObject<ProblemCheckDefinition>;

export function createProblemCheckObject<
  Definition extends ProblemCheckDefinition,
>(
  definition: Definition,
  data: Definition['Data'],
): ToProblemCheckObject<Definition> {
  return {
    [ERUDIT_CHECK_PREFIX]: true,
    name: definition.name,
    data,
  } satisfies ProblemCheckObject as ToProblemCheckObject<Definition>;
}

export function isProblemCheckObject(obj: any): obj is ProblemCheckObject {
  return obj?.[ERUDIT_CHECK_PREFIX] === true;
}

//
// Problem Checker
//

export type ToProblemChecker<Definition extends ProblemCheckDefinition> = {
  name: Definition['name'];
  check: (
    data: Definition['Data'],
    input: string,
  ) => Promise<boolean> | boolean;
};

export type ProblemChecker = ToProblemChecker<ProblemCheckDefinition>;
export type ProblemCheckers = { [problemCheckName: string]: ProblemChecker };

export function defineProblemChecker<Definition extends ProblemCheckDefinition>(
  definition: Definition,
  handler: ToProblemChecker<Definition>['check'],
): ToProblemChecker<Definition> {
  return {
    name: definition.name,
    check: handler,
  } satisfies ProblemChecker as ToProblemChecker<Definition>;
}
