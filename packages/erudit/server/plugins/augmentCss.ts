export default defineNitroPlugin((nitro) => {
    nitro.hooks.hook('render:html', (html) => {
        const style = ERUDIT.config.public.project.style;
        const brandColor = style?.brandColor;

        const debug = ERUDIT.config.public.project.debug;
        const slowTransition = debug.slowTransition;
        html.head.push(`
            <style>
:root {
    ${brandColor ? `--color-brand: ${brandColor};` : ''}
    --duration-multiplier: ${slowTransition ? `2.5` : `1`};
}
            </style>
        `);
    });
});
