<template>
    <hr :class="$style.hr" />
    <slot></slot>
</template>

<style lang="scss" module>
@mixin shade {
    height: 50px;
    border-bottom: 2px solid var(--border);
    background: linear-gradient(to bottom, transparent, var(--bgAside));
}

@mixin simple {
    height: var(--gap);
}

.hr {
    border: none;

    &::before,
    &::after {
        display: block;
        content: '';
    }

    &:nth-of-type(odd) {
        &::before {
            @include shade;
        }
        &::after {
            @include simple;
        }
    }

    &:nth-of-type(even) {
        &::before {
            @include simple;
        }
        &::after {
            @include shade;
            transform: scaleY(-1);
        }
    }
}
</style>
