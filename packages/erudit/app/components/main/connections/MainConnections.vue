<script lang="ts" setup>
import Deps from './Deps.vue';
import Externals from './Externals.vue';

defineProps<{ connections?: ContentConnections }>();

const phrase = await usePhrases('connections');

const currentType = ref<keyof ContentConnections | undefined>(
    'hardDependencies',
);
</script>

<template>
    <section
        v-if="connections"
        class="px-(--_pMainX) py-[calc(var(--_pMainY)/2)]"
    >
        <MainSubTitle :title="phrase.connections + ':'" />
        <div
            class="gap-small micro:gap-normal micro:justify-start flex flex-wrap
                justify-center"
        >
            <MainConnectionsButton
                v-for="(value, type) of connections"
                :type="type"
                :count="value!.length"
                :active="currentType === type"
                @click="
                    currentType === type
                        ? (currentType = undefined)
                        : (currentType = type)
                "
            />
        </div>
        <template v-if="currentType && connections[currentType]">
            <Deps
                v-if="currentType !== 'externals'"
                :deps="connections[currentType]!"
            />
            <Externals v-else :externals="connections[currentType]!" />
        </template>
    </section>
</template>
