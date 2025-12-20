export const $LINK = createLink();

(globalThis as any).$LINK = $LINK;

function createLink(path = '') {
    return new Proxy(
        { __link: path },
        {
            get(_, prop: string) {
                if (prop === '__link') return path;
                return createLink(path ? `${path}/${prop}` : prop);
            },
        },
    );
}
