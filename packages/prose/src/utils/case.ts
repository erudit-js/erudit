export type UppercaseFirst<S extends string> =
    S extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : S;

export function uppercaseFirst(str: string): string {
    if (str.length === 0) return str;
    return str[0].toUpperCase() + str.slice(1);
}

export type LowercaseFirst<S extends string> =
    S extends `${infer First}${infer Rest}` ? `${Lowercase<First>}${Rest}` : S;

export function lowercaseFirst(str: string): string {
    if (str.length === 0) return str;
    return str[0].toLowerCase() + str.slice(1);
}
