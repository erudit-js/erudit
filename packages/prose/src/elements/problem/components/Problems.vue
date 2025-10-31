<script lang="ts" setup>
import { ref } from 'vue';

import { isElement, type ParsedElement } from '../../../element';
import {
    SubProblem as SubProblemTag,
    type ProblemsSchema,
    type SubProblemSchema,
} from '../problems.global';
import type { BlockSchemaAny } from '../../../schema';
import { useFormatText } from '../../../app';
import ProseBlock from '../../../app/front/components/ProseBlock.vue';
import ProblemHeader from './ProblemHeader.vue';
import ProblemContainer from './ProblemContainer.vue';
import Render from '../../../app/front/components/Render.vue';
import ProblemButton from './ProblemButton.vue';
import Expander from '../../../shared/Expander.vue';
import SubProblem from './SubProblem.vue';

const { element } = defineProps<{ element: ParsedElement<ProblemsSchema> }>();
const formatText = useFormatText();

const sharedChildren = element.children.filter(
    (child) => !isElement(child, SubProblemTag),
) as ParsedElement<BlockSchemaAny>[];

const subProblems = element.children.filter((child) =>
    isElement(child, SubProblemTag),
) as ParsedElement<SubProblemSchema>[];

const activeSubProblemI = ref(0);
function getUnlabeledOrdinal(index: number) {
    let count = 0;
    for (let i = 0; i <= index; i++) {
        if (!subProblems[i].data.label) count++;
    }
    return count;
}
</script>

<template>
    <ProseBlock :element>
        <ProblemContainer>
            <ProblemHeader :info="element.data.info" />
            <div v-if="sharedChildren.length" class="pt-(--proseAsideWidth)">
                <Render
                    v-for="sharedChild of sharedChildren"
                    :element="sharedChild"
                />
            </div>
            <div
                class="gap-normal border-border flex flex-wrap border-b
                    px-(--proseAsideWidth) py-(--proseAsideWidth)
                    transition-[border]"
            >
                <ProblemButton
                    v-for="(subProblem, i) of subProblems"
                    :active="i === activeSubProblemI"
                    @click="activeSubProblemI = i"
                >
                    {{
                        subProblem.data.label
                            ? formatText(subProblem.data.label)
                            : getUnlabeledOrdinal(i)
                    }}
                </ProblemButton>
            </div>
            <Expander>
                <SubProblem
                    :key="activeSubProblemI"
                    :element="subProblems[activeSubProblemI]"
                />
            </Expander>
        </ProblemContainer>
    </ProseBlock>
</template>
