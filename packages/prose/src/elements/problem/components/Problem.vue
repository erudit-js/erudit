<script lang="ts" setup>
import type { ParsedElement } from '../../../element';
import type { ProblemSchema } from '../problem.global';
import { useElementStorage } from '../../../app/front/composables/elementStorage';
import ProseBlock from '../../../app/front/components/ProseBlock.vue';
import ProblemContainer from './ProblemContainer.vue';
import ProblemHeader from './ProblemHeader.vue';
import ProblemContent from './ProblemContent.vue';

const { element } = defineProps<{ element: ParsedElement<ProblemSchema> }>();
const problemStorage = await useElementStorage<ProblemSchema>(element);

// onMounted(async () => {
//     if (element.storageKey) {
//         const problemStorage = await useElementStorage<ProblemSchema>(element);
//         const problemGenerator = (
//             await import(/* @vite-ignore */ problemStorage!.generatorUrl)
//         ).default as ProblemGenerator;
//         console.log(
//             await problemGenerator.createProblemContent(Math.random(), {
//                 language: 'en',
//             }),
//         );
//     }
// });
</script>

<template>
    <ProseBlock :element>
        <ProblemContainer>
            <ProblemHeader :info="element.data.info" />
            <ProblemContent
                :initialElements="element.children"
                :generatorUrl="problemStorage?.generatorUrl"
            />
        </ProblemContainer>
    </ProseBlock>
</template>
