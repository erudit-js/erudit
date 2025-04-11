import type { EruditConfigDependencies } from '@erudit-js/cog/schema';

export const mathDeps: EruditConfigDependencies = {
    katex: {
        optimize: true,
    },
};

export const diagramDeps: EruditConfigDependencies = {
    mermaid: { optimize: true },
    ...mathDeps,
};
