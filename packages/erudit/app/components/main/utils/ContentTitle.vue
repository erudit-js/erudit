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
@use '$/def/bp';

.contentTitle {
    display: flex;
    align-items: center;
    gap: var(--gap);
    padding: 0 var(--_pMainX);

    [my-icon] {
        flex-shrink: 0;
        font-size: 1.65em;
        color: var(--textMuted);
        position: relative;
        top: 1px;
        cursor: help;
    }

    h1 {
        font-size: 1.925em;
    }

    @include bp.below('mobile') {
        padding-top: var(--gap);
        flex-direction: column;

        [my-icon] {
            padding: 16px;
            background: color-mix(
                in srgb,
                var(--textDisabled),
                transparent 50%
            );
            color: var(--text);
            border-radius: 50%;
        }

        h1 {
            text-align: center;
            font-size: 1.8em;
        }
    }
}
</style>
