export interface ElementData {
  name: string;
  registryItems: {
    schemaName: string;
    tagNames: string[];
  }[];
  absDirectory: string;
  absCorePath: string;
  absAppPath: string | undefined;
}
