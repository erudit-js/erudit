<script lang="ts" setup>
import type { ElementNode } from '@bitran-js/core';
import { injectFormatText, useElementPhrases } from '@bitran-js/renderer-vue';

import type { ProblemInfo } from '../shared';
import type { ProblemPhrases } from '../languages/phrases';
import { levelFront } from '../front/level';
import { attributeFront } from '../front/attribute';

defineProps<{
    node: ElementNode;
    info: ProblemInfo;
}>();

const pretty = injectFormatText();
const phrase = await useElementPhrases<ProblemPhrases>();
</script>

<template>
    <div :class="$style.problemContainer">
        <div :class="$style.info">
            <div :class="$style.top">
                <div :class="$style.title">{{ pretty(info.title) }}</div>
                <div :class="$style.asideSection">
                    <div
                        v-for="attribute in info.attributes?.sort()"
                        :class="$style.attribute"
                        :title="phrase(`attribute_explain.${attribute}`)"
                    >
                        <MyRuntimeIcon
                            name="attribute-icon"
                            wrapper="span"
                            :svg="attributeFront[attribute].icon"
                        />
                        {{ phrase(`attribute.${attribute}`) }}
                    </div>
                    <div
                        :class="$style.level"
                        :title="phrase('level_hint')"
                        :style="{
                            ['--levelColor']: levelFront[info.level].color,
                        }"
                    >
                        {{ pretty(phrase(`level.${info.level}`)) }}
                    </div>
                </div>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<style lang="scss" module>
@use '@bitran-js/renderer-vue/scss/bp' as bitranBp;

.problemContainer {
    --problemGap: var(--bitran_gap);
    --problemBg: light-dark(#f7f7f7, #282828);
    --problemBorder: color-mix(
        in srgb,
        var(--bitran_colorBorder),
        transparent 50%
    );

    display: flex;
    flex-direction: column;
    gap: var(--problemGap);
    background: var(--problemBg);
    border: 1px solid var(--problemBorder);
    border-radius: 10px;

    .info {
        padding: 0 var(--_bitran_asideWidth);
        padding-top: var(--problemGap);

        .top {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: var(--bitran_gap);

            @include bitranBp.below('mobile') {
                gap: var(--bitran_gapSmall);
                flex-direction: column;
                align-items: flex-start;
            }

            .title {
                flex: 1;
                font-size: 1.05em;
                font-weight: bold;
                color: var(--bitran_textDeep);
            }

            .asideSection {
                display: flex;
                align-items: center;
                gap: var(--bitran_gap);
                flex-wrap: wrap;

                @include bitranBp.below('mobile') {
                    gap: var(--bitran_gapSmall);
                    flex-direction: row-reverse;
                    justify-content: flex-end;
                }
            }

            .level {
                --levelColor: rgb(203, 65, 171);
                font-size: 0.8em;
                font-weight: 500;
                color: var(--levelColor);
                padding: 2px 8px;
                border-radius: 10px;
                border: 1px solid
                    color-mix(in srgb, var(--levelColor), transparent 80%);
                background: color-mix(
                    in srgb,
                    var(--levelColor),
                    transparent 90%
                );
                box-shadow: 0 2px 4px
                    color-mix(
                        in srgb,
                        var(--levelColor),
                        light-dark(transparent, rgba(black, 0.45)) 85%
                    );
                cursor: help;
            }
        }

        .attribute {
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: help;
            padding: 2px 8px;
            font-size: 0.8em;
            color: var(--textMuted);
            background: var(--bgMain);
            border-radius: 10px;
            border: 1px solid
                color-mix(
                    in srgb,
                    var(--bitran_colorBorder),
                    var(--bgAside) 50%
                );
            box-shadow: 0 1px 3px
                light-dark(rgba(black, 0.08), rgba(white, 0.05));

            [my-icon] {
                flex-shrink: 0;
            }
        }
    }
}
</style>
