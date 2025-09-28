function stringifyValue(value: unknown): string {
    if (value === null || typeof value !== 'object') {
        return JSON.stringify(value);
    }

    if (Array.isArray(value)) {
        return '[' + value.map(stringifyValue).join(',') + ']';
    }

    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    const props = keys.map(
        (k) => JSON.stringify(k) + ':' + stringifyValue(obj[k]),
    );

    return '{' + props.join(',') + '}';
}

export function toStringEqual(a: unknown, b: unknown): boolean {
    return stringifyValue(a) === stringifyValue(b);
}
