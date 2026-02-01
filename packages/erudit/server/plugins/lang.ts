export default defineNitroPlugin((nitro) => {
    nitro.hooks.hook('render:html', (html) => {
        html.htmlAttrs.push(`lang="${ERUDIT.config.public.language.current}"`);
    });
});
