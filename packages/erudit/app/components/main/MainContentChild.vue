<script lang="ts" setup>
defineProps<{ child: MainContentChildrenItem }>();
</script>

<template>
    <div
        class="border-border hocus:ring-brand/25 hocus:border-brand group
            rounded border bg-neutral-100 ring-2 ring-transparent
            transition-[border,box-shadow,background] dark:bg-neutral-800"
    >
        <h2
            class="text-main-lg group-hocus:text-brand font-bold
                transition-[color]"
        >
            <EruditLink :to="child.link" class="p-normal block">
                <MyIcon
                    :name="ICONS[child.type]"
                    class="text-text-muted group-hocus:text-brand mr-3 inline
                        text-[1.2em] transition-[color]"
                />
                <span>{{ formatText(child.title) }}</span>
            </EruditLink>
        </h2>
        <EruditLink
            v-if="child.description"
            :to="child.link"
            class="px-normal pb-normal block"
            >{{ formatText(child.description) }}</EruditLink
        >
        <div v-if="child.quickLinks" class="px-normal pb-normal">
            <MainQuickLinks :quickLinks="child.quickLinks" mode="children" />
        </div>
        <div v-if="child.elementCounts" class="px-normal pb-normal">
            <MainElementCounts
                :elementCounts="child.elementCounts"
                mode="children"
            />
        </div>
    </div>
</template>
