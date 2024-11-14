<script lang="ts" setup>
import { isMyIcon } from '#my-icons';

defineProps<{ icon: string; title: string; hint?: string }>();
</script>

<template>
    <section :class="$style.contentTitle">
        <MyIcon v-if="isMyIcon(icon)" :name="icon as any" :title="hint" />
        <MyRuntimeIcon
            v-else
            name="content-title-icon"
            :svg="icon"
            :title="hint"
        />
        <h1>{{ title }}</h1>
    </section>
</template>

<style lang="scss" module>
.contentTitle {
    display: flex;
    align-items: center;
    gap: var(--gap);
    padding: 0 var(--_pMainX);

    [my-icon] {
        font-size: 1.65em;
        color: var(--textMuted);
        position: relative;
        top: 1px;
        cursor: help;
    }

    h1 {
        font-size: 1.925em;
    }
}
</style>
