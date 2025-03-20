<script lang="ts" setup>
import { ref } from 'vue';
import { Render } from '@bitran-js/renderer-vue';

import type { AccentSection } from '../shared';
import toggleIcon from '../assets/toggle.svg?raw';

const props = defineProps<{ sections: AccentSection[] }>();

const openSections = ref<Record<string, boolean>>(
    Object.fromEntries(props.sections.map((section) => [section.id, false])),
);

const toggleSection = (sectionId: string) => {
    openSections.value[sectionId] = !openSections.value[sectionId];
};

const isSectionOpen = (sectionId: string) => {
    return openSections.value[sectionId] !== false;
};
</script>

<template>
    <div :class="$style.columnSections">
        <section
            v-for="section in sections"
            :class="[
                $style.section,
                !isSectionOpen(section.id) && $style.closed,
            ]"
        >
            <header @click="toggleSection(section.id)">
                {{ section.title || section.id }}
                <button :class="$style.toggleButton">
                    <MyRuntimeIcon name="section-toggle" :svg="toggleIcon" />
                </button>
            </header>
            <main>
                <div :class="$style.content">
                    <Render :node="section.content" />
                </div>
            </main>
        </section>
    </div>
</template>

<style lang="scss" module>
@use '@bitran-js/renderer-vue/scss/utils' as bitranUtils;

.columnSections {
    .section {
        border-top: 1px solid var(--accentColor_border);

        > header {
            font-weight: 600;
            color: var(--accentColor_text);
            padding: var(--bitran_gap) var(--_bitran_asideWidth);
            border-bottom: 1px dashed var(--accentColor_border);
            display: flex;
            align-items: center;
            cursor: pointer;

            @include bitranUtils.transition(border-color);

            &:hover .toggleButton {
                background: color-mix(
                    in srgb,
                    var(--accentColor_text),
                    transparent 85%
                );
            }

            .toggleButton {
                margin-left: auto;
                border-radius: 3px;
                background: none;
                border: none;
                padding: 5px;

                @include bitranUtils.transition(color, background);

                [my-icon] {
                    display: flex;
                    transform: rotate(45deg);
                    @include bitranUtils.transition(transform);
                }
            }
        }

        > main {
            overflow: hidden;
            height: auto;
            @include bitranUtils.transition(height);

            .content {
                padding: var(--bitran_gap) var(--_bitran_asideWidth);
                padding-left: 0;
            }
        }

        &.closed {
            > header {
                border-bottom-color: transparent;
            }

            > header .toggleButton [my-icon] {
                transform: rotate(0deg);
            }

            > main {
                height: 0;
            }
        }
    }
}
</style>
