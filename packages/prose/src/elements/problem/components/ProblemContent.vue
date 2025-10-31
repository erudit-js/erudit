<script lang="ts" setup>
import { computed, ref, shallowRef, watch, type Component } from 'vue';

import { isElement, type ParsedElement } from '../../../element';
import {
    ProblemCheck,
    ProblemHint,
    type ProblemAnswerSchema,
    type ProblemCheckSchema,
    type ProblemContentChild,
    type ProblemHintSchema,
    type ProblemNoteSchema,
    type ProblemSolutionSchema,
} from '../content';
import type { ProblemGenerator } from '../generator';
import { useProblemPhrase } from '../composables/phrase';
import { useIcon } from '../../../app/front/composables/icon';
import { isProblemActionElement, type ProblemAction } from '..';
import Render from '../../../app/front/components/Render.vue';
import Expander from '../../../shared/Expander.vue';
import ProblemButton from './ProblemButton.vue';
import Hint from './expanders/Hint.vue';
import DefaultPlusSections from './expanders/DefaultPlusSections.vue';
import Checks from './expanders/Checks.vue';
import { useProseAppContext } from '../../../app';

const { initialElements, generatorUrl } = defineProps<{
    generatorUrl: string | undefined;
    initialElements: ParsedElement<ProblemContentChild>[];
}>();

const Icon = useIcon();
const { languageCode } = useProseAppContext();
const phrase = await useProblemPhrase();

const actionIcons: Record<ProblemAction, string> = Object.fromEntries(
    Object.entries(
        import.meta.glob('../assets/actions/*.svg', {
            query: 'raw',
            eager: true,
            import: 'default',
        }),
    ).map(([key, value]) => {
        const name = key.split('/').pop()?.replace('.svg', '') ?? key;
        return [name as any, value as string];
    }),
);

const key = ref(0);
const elements =
    shallowRef<ParsedElement<ProblemContentChild>[]>(initialElements);
watch(elements, () => key.value++);

const description = computed(() => {
    return elements.value.at(0)!;
});

const expanderComponents: Record<
    Exclude<ProblemAction, 'generate'>,
    Component
> = {
    check: Checks,
    hint: Hint,
    answer: DefaultPlusSections,
    solution: DefaultPlusSections,
    note: DefaultPlusSections,
};

const expandableActions = computed(() => {
    type ActionMap<T> =
        T extends Partial<Exclude<Record<ProblemAction, any>, 'generate'>>
            ? T
            : never;

    const actionMap: ActionMap<{
        hint?: ParsedElement<ProblemHintSchema>[];
        answer?: ParsedElement<ProblemAnswerSchema>;
        solution?: ParsedElement<ProblemSolutionSchema>;
        note?: ParsedElement<ProblemNoteSchema>;
        check?: ParsedElement<ProblemCheckSchema>[];
    }> = {};

    const checks = elements.value.filter((element) =>
        isElement(element, ProblemCheck),
    );
    if (checks.length > 0) {
        actionMap.check = checks;
    }

    const hints = elements.value.filter((element) =>
        isElement(element, ProblemHint),
    );
    if (hints.length > 0) {
        actionMap.hint = hints;
    }

    (['answer', 'solution', 'note'] as const).forEach((action) => {
        const actionElements = elements.value.filter((element) =>
            isProblemActionElement(element, action),
        );

        if (actionElements.length > 0) {
            actionMap[action] = actionElements[0]! as any;
        }
    });

    return actionMap;
});

const currentAction = ref<Exclude<ProblemAction, 'generate'>>();

//
//
//

const generateRotation = ref(0);
const generating = ref(false);

async function doGenerate() {
    generateRotation.value += 180;

    if (generating.value) {
        return;
    }

    generating.value = true;

    const problemGenerator = (await import(/* @vite-ignore */ generatorUrl!))
        .default as ProblemGenerator;

    const newSeed = Math.floor(Math.random() * 1000000000) + 1;

    elements.value = await problemGenerator.createProblemContent(newSeed, {
        language: languageCode,
    });

    generating.value = false;
}
</script>

<template>
    <div>
        <Expander>
            <div class="py-(--proseAsideWidth)" :key>
                <Render
                    v-for="child of description.children"
                    :element="child"
                />
            </div>
        </Expander>
        <div
            v-if="
                Object.values(expandableActions).some(Boolean) || generatorUrl
            "
            class="gap-small micro:gap-normal flex flex-wrap
                p-(--proseAsideWidth) pt-0"
        >
            <ProblemButton
                v-for="(_, actionKey) in expandableActions"
                :key
                @click="
                    currentAction =
                        actionKey === currentAction ? undefined : actionKey
                "
                :active="actionKey === currentAction"
                class="flex items-center gap-[7px]"
            >
                <Icon :name="actionIcons[actionKey]" class="text-[15px]" />
                <span>{{ phrase[`action_${actionKey}`] }}</span>
            </ProblemButton>
            <ProblemButton
                v-if="generatorUrl"
                @click="doGenerate"
                class="flex items-center gap-[7px]"
            >
                <Icon
                    :name="actionIcons.generate"
                    :style="{ transform: `rotate(${generateRotation}deg)` }"
                    class="text-[15px] transition-[transform] backface-hidden"
                />
                <span>{{ phrase.action_generate }}</span>
            </ProblemButton>
        </div>
        <Expander>
            <component
                v-if="currentAction"
                :key
                :is="expanderComponents[currentAction]"
                :value="expandableActions[currentAction]"
            />
        </Expander>
    </div>
</template>
