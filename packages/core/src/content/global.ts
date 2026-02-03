//
// Typeguards used only for compile-time checks
//

declare const globalContentItemBrand: unique symbol;
declare const globalContentTopicPartBrand: unique symbol;
declare const globalContentUniqueBrand: unique symbol;

export interface GlobalContentItemTypeguard {
  [globalContentItemBrand]: true;
}

export interface GlobalContentTopicPartTypeguard {
  [globalContentTopicPartBrand]: true;
}

export interface GlobalContentUniqueTypeguard {
  [globalContentUniqueBrand]: true;
}

export type GlobalContentTypeguard =
  | GlobalContentItemTypeguard
  | GlobalContentTopicPartTypeguard
  | GlobalContentUniqueTypeguard;

//
// Real usage
//

export interface GlobalContentItem {
  __ERUDIT_globalContentItem: true;
  __path: string;
}

export function createGlobalContentProxy(path = '') {
  return new Proxy(
    {
      __ERUDIT_globalContentItem: true,
      __path: path,
    } satisfies GlobalContentItem,
    {
      get(_, prop: string) {
        if (prop === '__ERUDIT_globalContentItem') return true;
        if (prop === '__path') return path;
        const finalPath = path ? `${path}/${prop}` : prop;
        return createGlobalContentProxy(transformGlobalContentPath(finalPath));
      },
    },
  );
}

export function transformGlobalContentPath(path: string): string {
  const parts = path.split('/').filter((part) => part.length > 0);
  const finalParts: string[] = [];

  for (const part of parts) {
    if (part.startsWith('$')) {
      finalParts.push(part);
    } else {
      finalParts.push(part.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase());
    }
  }

  return finalParts.join('/');
}

export function createGlobalContent(path: string): GlobalContentItem {
  return {
    __ERUDIT_globalContentItem: true,
    __path: transformGlobalContentPath(path),
  };
}

export function isGlobalContent(value: any): value is GlobalContentItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    '__ERUDIT_globalContentItem' in value &&
    value.__ERUDIT_globalContentItem === true &&
    '__path' in value &&
    typeof value.__path === 'string'
  );
}

export function getGlobalContentPath(item: GlobalContentItem): string {
  return item.__path;
}
