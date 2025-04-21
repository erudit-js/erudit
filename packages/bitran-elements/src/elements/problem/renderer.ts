import {
    defineComponent,
    defineElementVueRenderer,
    defineIcon,
    defineLanguages,
} from '@bitran-js/renderer-vue';

import {
    ProblemNode,
    problemRenderDataGenerator,
    problemRenderDataKey,
    ProblemsNode,
    type ProblemRenderData,
    type ProblemSchema,
    type ProblemsSchema,
} from './shared';

const sharedRendererProps = {
    icon: defineIcon(() => import('./icon.svg?raw')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
};

export const problemRenderer = defineElementVueRenderer<ProblemSchema>({
    ...sharedRendererProps,
    Node: ProblemNode,
    component: defineComponent(() => import('./components/Problem.vue')),
    renderDataGenerator: problemRenderDataGenerator,
});

export const problemsRenderer = defineElementVueRenderer<ProblemsSchema>({
    ...sharedRendererProps,
    Node: ProblemsNode,
    component: defineComponent(() => import('./components/Problems.vue')),
    renderDataGenerator: {
        createValue({ storage, node }) {
            return {
                generatorContentPaths: node.parseData.set.map((problem) => {
                    const problemKey = problemRenderDataKey(
                        problem.generatorSrc,
                    );

                    if (problemKey === undefined) {
                        return undefined;
                    }

                    const problemValue = storage[problemKey];

                    if (!problemValue || problemValue.type === 'error') {
                        throw new Error(
                            `Problem render data not found in storage or has error state: ${problemKey}!`,
                        );
                    }

                    return (problemValue.data as ProblemRenderData)
                        .generatorContentPath;
                }),
            };
        },
    },
});
