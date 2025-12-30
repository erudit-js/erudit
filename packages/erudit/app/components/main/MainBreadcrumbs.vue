<script lang="ts" setup>
defineProps<{ breadcrumbs: Breadcrumbs }>();
</script>

<template>
    <section
        v-if="breadcrumbs.length > 0"
        class="gap-small max-micro:justify-center flex flex-wrap px-(--_pMainX)
            py-[calc(var(--_pMainY)/2)]"
    >
        <EruditLink
            v-for="(breadcrumb, i) of breadcrumbs"
            :to="breadcrumb.link"
            class="gap-small text-text-dimmed hocus:text-text-muted flex
                items-center transition-[color]"
        >
            <MaybeMyIcon :name="breadcrumb.icon" />
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
