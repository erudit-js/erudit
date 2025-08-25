export default defineNitroPlugin((nitro) => {
    nitro.hooks.hook('render:html', (html) => {
        for (let i = 0; i < html.head.length; i++) {
            const replaced = html.head[i].replace(
                /<meta\s+name="viewport"[^>]*>/i,
                '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0">',
            );

            if (replaced !== html.head[i]) {
                html.head[i] = replaced;
                break;
            }
        }
    });
});
