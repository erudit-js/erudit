<script lang="ts" setup>
import type { MyIconName } from '#my-icons';
import type { Context } from '@erudit/shared/content/context';

defineProps<{ context: Context }>();

const Link = defineNuxtLink({ prefetch: false });

function getIcon(contextIcon: string) {
    return contextIcon as MyIconName;
}
</script>

<template>
    <section :class="$style.breadcrumb">
        <template v-for="contextItem of context.slice(0, -1)">
            <Link :to="contextItem.href" :class="$style.breadcrumbItem">
                <MyIcon :name="getIcon(contextItem.icon)" wrapper="span" />
                {{ contextItem.title }}
            </Link>
            <MyIcon :class="$style.sep" name="angle-right" />
        </template>
    </section>
</template>

<style lang="scss" module>
.breadcrumb {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--gapSmall);
    padding: var(--_pMainY) var(--_pMainX);
    color: var(--textDimmed);
    overflow: hidden;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 30px;
        height: 100%;
        background: linear-gradient(to right, transparent, var(--bgMain));
    }

    .breadcrumbItem {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: var(--gapSmall);

        line-height: 0;
        font-weight: 450;
        color: var(--textDimmed);
        text-decoration: none;

        @include transition(color);

        &:hover {
            color: var(--textMuted);
        }
    }

    .sep {
        flex-shrink: 0;
        position: relative;
        top: 0.5px;
    }
}
</style>
