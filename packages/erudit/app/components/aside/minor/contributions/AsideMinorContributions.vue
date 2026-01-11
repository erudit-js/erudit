<script lang="ts" setup>
import ItemBook from './ItemBook.vue';
import ItemContent from './ItemContent.vue';

const { asideMinorState } = useAsideMinor();
const contributions = (asideMinorState.value as AsideMinorContributions)
    .contributions;

const phrase = await usePhrases('contribution', 'no_contribution');
</script>

<template>
    <AsideMinorPane>
        <div class="absolute top-0 left-0 flex h-full w-full flex-col">
            <AsideMinorPlainHeader
                icon="draw"
                :title="phrase.contribution"
                :count="contributions?.length"
            />
            <ScrollHolder v-if="contributions" class="flex-1">
                <TreeContainer>
                    <template v-for="item of contributions">
                        <ItemContent
                            v-if="item.type === 'topic' || item.type === 'page'"
                            :content="item"
                        />
                        <ItemBook
                            v-else-if="item.type === 'book'"
                            :book="item"
                        />
                    </template>
                </TreeContainer>
            </ScrollHolder>
            <section v-else>
                <p class="text-text-muted p-normal text-center">
                    {{ phrase.no_contribution }}
                </p>
            </section>
        </div>
    </AsideMinorPane>
</template>
