import type { ArgDef } from 'citty';

export const projectPathArg = {
    projectPath: {
        type: 'positional',
        description:
            'Erudit project directory. Can also be set via ERUDIT_PROJECT_PATH env variable.',
        required: false,
        valueHint: '.',
    },
} satisfies { projectPath: ArgDef };

export const siteUrlArg = {
    siteUrl: {
        type: 'string',
        description:
            'Erudit full site URL. Can also be set via ERUDIT_SITE_URL env variable.',
        required: false,
        valueHint: 'https://my-awesome-site.com/',
    },
} satisfies { siteUrl: ArgDef };

export const basePathArg = {
    basePath: {
        type: 'string',
        description:
            'Base path for Erudit site. Can also be set via ERUDIT_BASE_PATH env variable.',
        required: false,
        valueHint: '/subfolder/',
    },
} satisfies { basePath: ArgDef };

export const contentTargetsArg = {
    target: {
        type: 'string',
        description: 'Content targets to process',
        required: false,
        valueHint: '"combinatorics"',
    },
} satisfies { target: ArgDef };

export const nitroPresetArg = {
    preset: {
        type: 'string',
        required: false,
        description:
            '(Nuxt Build Flag) Nitro preset to use for building. Can also be set via ERUDIT_NITRO_PRESET env variable.',
    },
} satisfies { preset: ArgDef };
