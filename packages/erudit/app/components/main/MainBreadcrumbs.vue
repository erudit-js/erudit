<script lang="ts" setup>
defineProps<{ breadcrumbs: Breadcrumbs }>();
</script>

<template>
    <section
        v-if="breadcrumbs.length > 0"
        class="gap-small max-micro:justify-center px-main py-main-half flex
            flex-wrap"
    >
        <EruditLink
            v-for="(breadcrumb, i) of breadcrumbs"
            :to="breadcrumb.link"
            class="gap-small text-text-dimmed hocus:text-text-muted flex
                items-center transition-[color]"
        >
            <MaybeMyIcon :name="breadcrumb.icon" class="text-[1.2em]" />
            <span>{{ formatText(breadcrumb.title) }}</span>
            <MyIcon
                name="chevron-right"
                :class="{
                    'relative -left-[3px]': true,
                    'rotate-90': i === breadcrumbs.length - 1,
                }"
            />
        </EruditLink>
    </section>
</template>
