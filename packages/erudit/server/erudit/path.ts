import { sn } from 'unslash';

export interface EruditServerPaths {
  erudit(...paths: string[]): string;
  project(...paths: string[]): string;
}

export async function setupServerPaths() {
  const runtimeConfig = useRuntimeConfig();

  const pathConstructor = (basePart: string) => {
    return (...parts: string[]) => sn(...[basePart, ...parts]);
  };

  ERUDIT.paths = {
    erudit: pathConstructor(runtimeConfig.eruditPath),
    project: pathConstructor(runtimeConfig.projectPath),
  };
}
