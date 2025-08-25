import { readFileSync } from 'node:fs';

let setupScript: string;

export default defineNitroPlugin((nitro) => {
    nitro.hooks.hook('render:html', (html) => {
        setupScript ||= readFileSync(
            ERUDIT.config.paths.package + '/app/scripts/theme.js',
            'utf-8',
        );
        html.head.push(`<script>${setupScript}</script>`);
    });
});
