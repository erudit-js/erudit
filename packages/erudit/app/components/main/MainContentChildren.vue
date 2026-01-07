<script lang="ts" setup>
defineProps<{ children: MainContentChildrenItem[] }>();
</script>

<template>
    <MainSection>
        <div class="flex flex-col gap-(--_pMainX) p-(--_pMainX)">
            <MainContentChild v-for="child of children" :child />
        </div>
    </MainSection>
</template>
