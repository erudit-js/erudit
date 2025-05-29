<script lang="ts" setup>
import { isMyIcon, type MyIconName } from '#my-icons';
import { computed } from 'vue';

const props = defineProps<{
    link?: string;
    icon?: string;
    main?: string;
    active?: boolean;
    secondary?: string;
}>();

const isExternalLink = computed(() => {
    if (!props.link) return false;
    return (
        props.link.startsWith('http://') ||
        props.link.startsWith('https://') ||
        props.link.startsWith('//')
    );
});

const vnode = h(
    props.link ? defineNuxtLink({ trailingSlash: 'append' }) : 'div',
);
</script>

<template>
    <component
        :is="vnode"
        :to="link"
        :target="isExternalLink ? '_blank' : undefined"
        :rel="isExternalLink ? 'noopener noreferrer' : undefined"
        :class="[$style.asideListItem, active ? $style.active : '']"
    >
        <slot>
            <template v-if="icon">
                <MyIcon v-if="isMyIcon(icon)" :name="icon as MyIconName" />
                <MyRuntimeIcon v-else name="AsideListItem Icon" :svg="icon" />
            </template>
            <div :class="$style.main">{{ main }}</div>
            <div v-if="secondary" :class="$style.secondary">
                {{ secondary }}
            </div>
        </slot>
    </component>
</template>

<style lang="scss" module>
.asideListItem {
    display: flex;
    align-items: center;
    gap: var(--gap);
    padding: var(--gap);
    height: 60px;
    border-bottom: 1px solid var(--border);
    color: var(--textMuted);
    text-decoration: none;
    background: transparent;
    cursor: pointer;
    @include transition(color, background);

    &:hover {
        color: var(--text);
        background: var(--bgAccent);
    }

    [my-icon] {
        position: relative;
        top: 1px;
        flex-shrink: 0;
        font-size: 20px;
    }

    .secondary {
        font-weight: 500;
        color: var(--textDimmed);
    }

    [my-icon],
    .main {
        @include transition(color);
    }

    &.active {
        [my-icon],
        .main {
            color: var(--brand);
        }
    }
}
</style>
