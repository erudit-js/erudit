export function objectsEqual(a: any, b: any) {
    const str = (obj: any) => JSON.stringify(obj)?.split('').sort().join('');
    return str(a) === str(b);
}
