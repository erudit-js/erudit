export interface EruditDependency {
  transpile?: boolean;
  optimize?: boolean;
}

export type EruditDependencies = { [dependencyName: string]: EruditDependency };
