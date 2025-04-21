<script lang="ts" setup>
import {
    computed,
    defineComponent,
    h,
    ref,
    shallowRef,
    useTemplateRef,
} from 'vue';
import { autoUpdate, useFloating } from '@floating-ui/vue';
import type { ElementNode } from '@bitran-js/core';
import { useElementPhrases, injectFormatText } from '@bitran-js/renderer-vue';

import ProblemAction from './ProblemAction.vue';
import PaneView from '../../../shared/PaneView.vue';
import ProblemContentItemComponent from './ProblemContentItem.vue';
import Expander from '../../../shared/Expander.vue';
import type { ProblemPhrases } from '../languages/phrases';
import { type ProblemContent, type ProblemContentItem } from '../shared';
import { actionFront } from '../front/action';
import {
    type ProblemGeneratorReturn,
    type ProblemGeneratorData,
    type ProblemSeed,
    Randomizer,
} from '../generator';

const props = defineProps<{
    node: ElementNode;
    content: ProblemContent;
    generatorContentPath?: string;
}>();

const pretty = injectFormatText();
const phrase = await useElementPhrases<ProblemPhrases>();

const actions = ['hint', 'solution', 'answer', 'note'] as const;
const action2Content: Record<(typeof actions)[number], keyof ProblemContent> = {
    hint: 'hints',
    solution: 'solution',
    answer: 'answer',
    note: 'note',
};

const presentActions = actions.filter((action) => {
    return action2Content[action] in props.content;
});
const activeAction = ref<(typeof actions)[number]>();

//
// Generator Logic
//

const iconRotation = ref(0);
const iconRotationValue = computed(() => `${iconRotation.value}deg`);

const generatorData = shallowRef<ProblemGeneratorData>();
const generatedResult = shallowRef<ProblemGeneratorReturn>();
const hasGenerator = Boolean(props.generatorContentPath);

const seed = ref<ProblemSeed>();
const useCustomSeed = ref(true);

async function regenerateProblem() {
    iconRotation.value += 180;

    if (useCustomSeed.value) {
        useCustomSeed.value = false;
    } else {
        seed.value = String(
            Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
        );
    }

    const randomizer = new Randomizer(seed.value!);
    const result = await generatorData.value!.generator(randomizer);

    generatedResult.value = result;
}

if (hasGenerator) {
    const loaders = (await import('#erudit/problemGenerators')).loaders;
    const loader = loaders[props.generatorContentPath! as keyof typeof loaders];

    if (!loader) {
        throw new Error(
            `Problem generator loader not found for path: ${props.generatorContentPath}!`,
        );
    }

    generatorData.value = (await loader()) as ProblemGeneratorData;
    seed.value = generatorData.value!.defaultSeed;
    await regenerateProblem();
}

function onSeedInput() {
    useCustomSeed.value = true;
}

// Seed popup

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

//
//
//

const ContentItem = defineComponent({
    name: 'ContentItem',
    props: {
        item: {
            type: Object as () => ProblemContentItem,
            required: true,
        },
    },
    setup(_props) {
        return () => {
            return h(ProblemContentItemComponent, {
                node: props.node,
                contentItem: _props.item,
                generatedResult: generatedResult.value,
            });
        };
    },
});
</script>

<template>
    <div :class="$style.problemContent">
        <ContentItem :item="content.description" :class="$style.description" />

        <div :class="$style.actions" v-if="presentActions.length > 0">
            <ProblemAction
                v-for="action of presentActions"
                :icon="actionFront[action].icon"
                :label="phrase(`action_${action}`)"
                :active="activeAction === action"
                @click="
                    activeAction = activeAction === action ? undefined : action
                "
            />
            <template v-if="hasGenerator">
                <div
                    ref="seedReference"
                    @touchstart="seedPopupVisible = true"
                    @mouseenter="seedPopupVisible = true"
                    @mouseleave="seedPopupVisible = false"
                >
                    <ProblemAction
                        :icon="actionFront.generate.icon"
                        :label="phrase('action_generate')"
                        :active="false"
                        @click="regenerateProblem"
                        :class="$style.generateAction"
                    />

                    <TransitionFade>
                        <div
                            v-if="seedPopupVisible"
                            ref="seedPopup"
                            :class="$style.seedPopup"
                            :style="seedFloatingStyles"
                        >
                            <input
                                type="text"
                                v-model="seed"
                                @input="onSeedInput"
                                :title="phrase('seed_explain')"
                            />
                        </div>
                    </TransitionFade>
                </div>
            </template>
        </div>

        <PaneView :paneKey="activeAction || Symbol()">
            <div v-if="activeAction" :class="$style.activeActionPane">
                <ContentItem
                    v-if="['answer', 'note'].includes(activeAction)"
                    :item="content[activeAction as 'answer' | 'note']!"
                />
                <template v-else-if="activeAction === 'hint'">
                    <ContentItem
                        v-if="content['hints']!.length === 1"
                        :item="content['hints']![0]!"
                    />
                    <Expander
                        v-else
                        v-for="(hint, i) of content['hints']!"
                        :class="$style.expander"
                        :label="`${phrase('action_hint')} ${i + 1}`"
                    >
                        <ContentItem :item="hint!" />
                    </Expander>
                </template>
                <template v-else-if="activeAction === 'solution'">
                    <ContentItem
                        v-if="'' in content.solution!"
                        :item="content.solution['']!"
                    />
                    <Expander
                        v-for="label of Object.keys(content.solution!).slice(
                            '' in content.solution! ? 1 : 0,
                        )"
                        :class="$style.expander"
                        :label="pretty(label)"
                    >
                        <ContentItem :item="content.solution![label]!" />
                    </Expander>
                </template>
            </div>
        </PaneView>
    </div>
</template>

<style lang="scss" module>
@use '@bitran-js/renderer-vue/scss/bp' as bitranBp;
@use '@bitran-js/renderer-vue/scss/utils' as bitranUtils;

.problemContent {
    .description {
        padding-top: 0;
    }

    .actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--bitran_gap);
        padding: var(--problemGap) var(--_bitran_asideWidth);
        padding-top: 0;

        @include bitranBp.below('mobile') {
            gap: var(--bitran_gapSmall);
        }
    }

    .generateAction {
        [my-icon] {
            transform: rotate(v-bind(iconRotationValue));
            @include bitranUtils.transition(transform, color);
        }
    }

    .activeActionPane {
        border-top: 1px solid var(--bitran_colorBorder);

        .expander {
            --_expander_textColor: var(--bitran_textMuted);

            &:first-of-type {
                border-top: none;
            }
        }

        & > :not(.expander) ~ .expander {
            border-top: 1px solid var(--bitran_colorBorder);
        }
    }

    .seedPopup {
        height: 42px;

        input {
            padding: 5px;
            border-radius: 5px;
            border: none;
            text-align: center;
            font-size: 11px;
            background: light-dark(#262626, #7e7e7e);
            color: light-dark(#fff, #000);
            box-shadow: 1px 2px 8px var(--bitran_colorBorder);
        }
    }
}
</style>
