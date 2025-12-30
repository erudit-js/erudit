<script lang="ts" setup></script>

<template>
    <div
        class="nice-scrollbars border-border relative mt-(--_pMainY) flex
            max-h-[500px] flex-col gap-[calc(var(--_pMainY)/2)] overflow-auto
            border-t border-b py-(--_pMainY) transition-[border]"
    >
        <slot></slot>
    </div>
</template>
