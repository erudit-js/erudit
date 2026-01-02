<script lang="ts" setup>
defineProps<{ children: MainContentChildrenItem[] }>();
</script>

<template>
    <MainSection>
        <div class="gap-big flex flex-col p-(--_pMainX)">
            <MainContentChild v-for="child of children" :child />
        </div>
    </MainSection>
</template>
