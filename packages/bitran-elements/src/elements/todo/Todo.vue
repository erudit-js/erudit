<script lang="ts" setup>
import {
    useElementIcon,
    useElementParseData,
    Render,
    type ElementProps,
} from '@bitran-js/renderer-vue';

import { type TodoSchema } from './shared';

defineProps<ElementProps<TodoSchema>>();
const parseData = useElementParseData<TodoSchema>();
const todoIcon = await useElementIcon();
</script>

<template>
    <div :class="$style.todo">
        <header>
            <MyRuntimeIcon name="tood-icon" :svg="todoIcon" />
            <span>{{ parseData.title }}</span>
        </header>
        <div :class="$style.content" v-if="parseData.content">
            <Render :node="parseData.content" />
        </div>
    </div>
</template>

<style lang="scss" module>
.todo {
    border-radius: 5px;
    background: light-dark(#f8eeb9, #342d0f);
    border: 1px solid light-dark(#c3b66f, #5e511b);
    color: light-dark(#7f701c, #b3a570);

    > header {
        display: flex;
        align-items: center;
        gap: var(--bitran_gap);
        padding: var(--bitran_gap);
        font-weight: 600;
    }

    .content {
        padding: var(--bitran_gap);
        padding-left: 0;
        padding-top: 0;
        padding-right: var(--_bitran_asideWidth);
    }
}
</style>
