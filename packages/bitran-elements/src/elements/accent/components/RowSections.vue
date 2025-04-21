<script lang="ts" setup>
import { ref, computed } from 'vue';
import { Render } from '@bitran-js/renderer-vue';

import PaneView from '../../../shared/PaneView.vue';
import type { AccentSection } from '../shared';

const props = defineProps<{ sections: AccentSection[] }>();

const activeSection = ref<AccentSection | undefined>();

const selectSection = (section: AccentSection) => {
    if (activeSection.value?.id === section.id) {
        activeSection.value = undefined;
    } else {
        activeSection.value = section;
    }
};

const isSectionActive = (sectionId: string) => {
    return activeSection.value?.id === sectionId;
};

const activeContent = computed(() => {
    return activeSection.value?.content;
});
</script>

<template>
    <div :class="$style.rowSections">
        <div
            :class="[$style.sectionButtons, !activeSection && $style.noBorder]"
        >
            <button
                v-for="section in props.sections"
                :class="[
                    $style.sectionButton,
                    isSectionActive(section.id) && $style.active,
                ]"
                @click="selectSection(section)"
            >
                {{ section.title || section.id }}
            </button>
        </div>

        <PaneView :paneKey="activeSection?.id || Symbol()">
            <div v-if="activeContent" :class="$style.activeSection">
                <Render :node="activeContent" />
            </div>
        </PaneView>
    </div>
</template>

<style lang="scss" module>
@use '@bitran-js/renderer-vue/scss/utils' as bitranUtils;

.rowSections {
    .sectionButtons {
        display: flex;
        flex-wrap: wrap;
        gap: var(--bitran_gap);
        border-bottom: 1px dashed var(--accentColor_border);
        padding: var(--bitran_gap);
        padding-top: 0;
        padding-bottom: var(--_bitran_asideWidth);

        @include bitranUtils.transition(border-color);

        &.noBorder {
            border-bottom-color: transparent;
        }

        .sectionButton {
            padding: 6px 12px;
            background: light-dark(
                color-mix(in hsl, var(--accentColor_background), black 8%),
                color-mix(in hsl, var(--accentColor_background), white 8%)
            );
            border-radius: 4px;
            font-weight: 500;
            font-size: 0.86em;
            color: var(--accentColor_text);
            cursor: pointer;

            @include bitranUtils.transition(background-color, color);

            &:hover {
                background: light-dark(
                    color-mix(in hsl, var(--accentColor_background), black 14%),
                    color-mix(in hsl, var(--accentColor_background), white 12%)
                );
            }

            &.active {
                background: light-dark(
                    color-mix(in hsl, var(--accentColor_text), white 12%),
                    color-mix(in hsl, var(--accentColor_text), black 12%)
                );
                color: var(--accentColor_background, #fff);
                border-color: var(--accentColor_text);
            }
        }
    }

    .activeSection {
        padding: var(--bitran_gap);
        padding-left: 0;
        padding-right: var(--_bitran_asideWidth);
    }
}
</style>
