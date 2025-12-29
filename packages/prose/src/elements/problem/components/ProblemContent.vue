<script lang="ts" setup>
import {
    computed,
    onMounted,
    ref,
    shallowRef,
    useTemplateRef,
    watchEffect,
    type Component,
} from 'vue';
import { autoUpdate, offset, useFloating } from '@floating-ui/vue';
import {
    isProseElement,
    resolveRawElement,
    type ProseElement,
} from '@jsprose/core';

import {
    problemAnswer,
    problemCheckSchema,
    problemDescriptionSchema,
    problemHintSchema,
    problemNote,
    problemSolution,
    type CheckFunction,
    type ProblemContentChild,
} from '../problemContent.js';
import { useProseContext } from '../../../app/composables/context.js';
import { useProblemPhrase } from '../composables/phrase.js';
import type { ProblemAction } from '../shared.js';
import { useArrayContainsAnchor } from '../../../app/composables/anchor.js';
import type { ProblemScriptInstance } from '../problemScript.js';
import type { problemSchema } from '../problem.js';
import type { subProblemSchema } from '../problems.js';
import { useElementStorage } from '../../../app/composables/storage.js';
import type { ProblemScriptStorage } from '../storage.js';
import { createProblemScriptInstance } from '../composables/problemScript.js';
import { DEFAULT_SEED, type ProblemSeed } from '../rng.js';
import plusIcon from '../../../app/shared/assets/plus.svg?raw';
import Render from '../../../app/shared/Render.vue';
import Hint from './expanders/Hint.vue';
import DefaultPlusSections from './expanders/DefaultPlusSections.vue';
import ProblemButton from './ProblemButton.vue';
import Checks from './expanders/Checks.vue';

const { element, initialElements } = defineProps<{
    element:
        | ProseElement<typeof problemSchema>
        | ProseElement<typeof subProblemSchema>;
    initialElements: ProseElement<ProblemContentChild>[];
}>();

const { EruditIcon, EruditTransition } = useProseContext();
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
        check?: {
            checkElements: ProseElement<typeof problemCheckSchema>[];
            checkFunction?: CheckFunction;
        };
    }> = {};

    const checks = elements.value.filter((element) =>
        isProseElement(element, problemCheckSchema),
    );
    if (checks.length > 0) {
        actionMap.check = {
            checkElements: checks,
            checkFunction: scriptCheck.value,
        };
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
// Problem Script
//

const scriptInstance = shallowRef<ProblemScriptInstance>();
const scriptStorage = (await useElementStorage(
    element as any,
)) as ProblemScriptStorage;
const isGenerator = computed(() => Boolean(scriptInstance.value?.isGenerator));
const scriptCheck = shallowRef<CheckFunction>();

onMounted(async () => {
    scriptInstance.value = await createProblemScriptInstance(
        scriptStorage?.resolvedScriptSrc,
        element.data.scriptUniques,
    );

    if (scriptInstance.value) {
        const initialGenerateResult =
            scriptInstance.value!.generate(DEFAULT_SEED);
        scriptCheck.value = initialGenerateResult.check;
    }
});

const generateRotation = ref(0);
const generating = ref(false);
const seed = ref<ProblemSeed>(DEFAULT_SEED);
const usingCustomSeed = ref(false);

async function doGenerate() {
    if (!scriptInstance.value) {
        return;
    }

    generateRotation.value += 180;

    if (generating.value) {
        return;
    }

    generating.value = true;

    if (usingCustomSeed.value) {
        usingCustomSeed.value = false;
    } else {
        seed.value = Math.floor(Math.random() * 1000000000) + 1;
    }

    const generateResult = scriptInstance.value.generate(seed.value);

    if (generateResult.check) {
        scriptCheck.value = generateResult.check;
    }

    const rawElements = generateResult.problemContent;
    const proseElements: ProseElement<ProblemContentChild>[] = [];
    for (const rawElement of rawElements) {
        const resolveResult = await resolveRawElement({
            rawElement,
            linkable: false,
        });
        proseElements.push(resolveResult.proseElement as any);
    }

    elements.value = proseElements;

    key.value++;
    generating.value = false;
}

//
// Seed Popup
//

const seedPopupVisible = ref(false);
const seedReferenceElement = useTemplateRef('seedReference');
const seedPopupElement = useTemplateRef('seedPopup');

const { floatingStyles: seedFloatingStyles } = useFloating(
    seedReferenceElement,
    seedPopupElement,
    {
        whileElementsMounted: autoUpdate,
        placement: 'top',
    },
);
</script>

<template>
    <div>
        <Suspense suspensible>
            <div class="py-(--proseAsideWidth)" :key>
                <Render
                    v-for="child of description.children"
                    :element="child"
                />
            </div>
        </Suspense>

        <div
            v-if="Object.values(expandableActions).some(Boolean) || isGenerator"
            class="gap-small micro:gap-normal flex flex-wrap
                p-(--proseAsideWidth) pt-0"
        >
            <ProblemButton
                v-for="(_, actionKey) in expandableActions"
                :key="actionKey"
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
            <div
                v-if="isGenerator"
                ref="seedReference"
                @mouseenter="seedPopupVisible = true"
                @mouseleave="seedPopupVisible = false"
            >
                <ProblemButton
                    @touchstart="
                        seedPopupVisible = seedPopupVisible ? false : true
                    "
                    @click="doGenerate"
                    class="flex items-center gap-[7px]"
                >
                    <EruditIcon
                        :name="actionIcons.generate"
                        :style="{ transform: `rotate(${generateRotation}deg)` }"
                        class="text-[15px] transition-[transform]
                            backface-hidden"
                    />
                    <span>{{ phrase.action_generate }}</span>
                </ProblemButton>
                <EruditTransition>
                    <div
                        v-if="seedPopupVisible"
                        ref="seedPopup"
                        :style="seedFloatingStyles"
                        class="pb-2.5"
                    >
                        <form
                            class="shadow-border text-main-xs flex rounded
                                bg-neutral-900 text-white shadow-lg
                                dark:bg-neutral-200 dark:text-black"
                            @submit.prevent="doGenerate"
                        >
                            <input
                                type="text"
                                v-model="seed"
                                @input="usingCustomSeed = true"
                                :title="phrase.seed_explain"
                                @focus="($event as any).target.select()"
                                class="max-w-[100px] flex-1 p-[5px] text-center
                                    outline-none"
                            />
                            <button
                                v-if="seed !== DEFAULT_SEED"
                                type="button"
                                @click="
                                    seed = DEFAULT_SEED;
                                    usingCustomSeed = true;
                                    doGenerate();
                                "
                                class="cursor-pointer py-[5px] pr-2"
                            >
                                <EruditIcon
                                    :name="plusIcon"
                                    class="hocus:text-white
                                        dark:hocus:text-black rotate-45
                                        text-[15px] text-neutral-400
                                        transition-[color]
                                        dark:text-neutral-600"
                                />
                            </button>
                        </form>
                    </div>
                </EruditTransition>
            </div>
        </div>

        <Suspense suspensible>
            <component
                v-if="currentAction"
                :key
                :is="expanderComponents[currentAction]"
                :value="expandableActions[currentAction]"
            />
        </Suspense>
    </div>
</template>
