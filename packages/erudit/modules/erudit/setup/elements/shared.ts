export interface ElementData {
  name: string;
  coreElements: {
    schemaName: string;
    tags: Record<string, number>;
  }[];
  absDirectory: string;
  absCorePath: string;
  absAppPath: string | undefined;
}
