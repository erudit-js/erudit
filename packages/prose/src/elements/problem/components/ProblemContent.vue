<script lang="ts" setup>
import { computed, ref, shallowRef, watchEffect, type Component } from 'vue';
import { isProseElement, type ProseElement } from '@jsprose/core';

import {
    problemAnswer,
    problemCheckSchema,
    problemDescriptionSchema,
    problemHintSchema,
    problemNote,
    problemSolution,
    type ProblemContentChild,
} from '../problemContent.js';
import { useProseContext } from '../../../app/composables/context.js';
import { useProblemPhrase } from '../composables/phrase.js';
import type { ProblemAction } from '../shared.js';
import { useArrayContainsAnchor } from '../../../app/composables/anchor.js';
import Render from '../../../app/shared/Render.vue';
import Hint from './expanders/Hint.vue';
import DefaultPlusSections from './expanders/DefaultPlusSections.vue';
import ProblemButton from './ProblemButton.vue';
import Checks from './expanders/Checks.vue';

const { scriptUrl, initialElements } = defineProps<{
    scriptUrl?: string;
    initialElements: ProseElement<ProblemContentChild>[];
}>();

const { EruditIcon, languageCode } = useProseContext();
const phrase = await useProblemPhrase();

const actionIcons: Record<ProblemAction, string> = Object.fromEntries(
    Object.entries(
        // @ts-ignore
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
    shallowRef<ProseElement<ProblemContentChild>[]>(initialElements);

const description = computed(() => {
    return elements.value.find((element) =>
        isProseElement(element, problemDescriptionSchema),
    )!;
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
        hint?: ProseElement<typeof problemHintSchema>[];
        answer?: ProseElement<typeof problemAnswer.schema>;
        solution?: ProseElement<typeof problemSolution.schema>;
        note?: ProseElement<typeof problemNote.schema>;
        check?: ProseElement<typeof problemCheckSchema>[];
    }> = {};

    const checks = elements.value.filter((element) =>
        isProseElement(element, problemCheckSchema),
    );
    if (checks.length > 0) {
        actionMap.check = checks;
    }

    const hints = elements.value.filter((element) =>
        isProseElement(element, problemHintSchema),
    );
    if (hints.length > 0) {
        actionMap.hint = hints;
    }

    (['answer', 'solution', 'note'] as const).forEach((action) => {
        const actionElements = elements.value.filter((element) => {
            switch (action) {
                case 'answer':
                    return isProseElement(element, problemAnswer.schema);
                case 'solution':
                    return isProseElement(element, problemSolution.schema);
                case 'note':
                    return isProseElement(element, problemNote.schema);
            }
        });

        if (actionElements.length > 0) {
            actionMap[action] = actionElements[0]! as any;
        }
    });

    return actionMap;
});

const currentAction = ref<Exclude<ProblemAction, 'generate'>>();

const containsAnchorArray = useArrayContainsAnchor(elements.value);

watchEffect(() => {
    const anchorIndex = containsAnchorArray.value;

    if (anchorIndex === undefined) {
        return;
    }

    const anchorElement = elements.value.at(anchorIndex);

    switch (true) {
        case isProseElement(anchorElement, problemHintSchema):
            currentAction.value = 'hint';
            break;
        case isProseElement(anchorElement, problemAnswer.schema):
            currentAction.value = 'answer';
            break;
        case isProseElement(anchorElement, problemSolution.schema):
            currentAction.value = 'solution';
            break;
        case isProseElement(anchorElement, problemNote.schema):
            currentAction.value = 'note';
            break;
    }
});

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

    // const problemGenerator = (await import(/* @vite-ignore */ generatorUrl!))
    //     .default as ProblemGenerator;

    const newSeed = Math.floor(Math.random() * 1000000000) + 1;

    // elements.value = await problemGenerator.createProblemContent(newSeed, {
    //     language: languageCode,
    // });

    generating.value = false;
}
</script>

<template>
    <div>
        <Suspense>
            <div class="py-(--proseAsideWidth)" :key>
                <Render
                    v-for="child of description.children"
                    :element="child"
                />
            </div>
        </Suspense>

        <div
            v-if="Object.values(expandableActions).some(Boolean) || scriptUrl"
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
                <EruditIcon
                    :name="actionIcons[actionKey]"
                    class="text-[15px]"
                />
                <span>{{ phrase[`action_${actionKey}`] }}</span>
            </ProblemButton>
            <ProblemButton
                v-if="scriptUrl"
                @click="doGenerate"
                class="flex items-center gap-[7px]"
            >
                <EruditIcon
                    :name="actionIcons.generate"
                    :style="{ transform: `rotate(${generateRotation}deg)` }"
                    class="text-[15px] transition-[transform] backface-hidden"
                />
                <span>{{ phrase.action_generate }}</span>
            </ProblemButton>
        </div>

        <Suspense>
            <component
                v-if="currentAction"
                :key
                :is="expanderComponents[currentAction]"
                :value="expandableActions[currentAction]"
            />
        </Suspense>
    </div>
</template>
