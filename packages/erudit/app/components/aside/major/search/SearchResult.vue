<script lang="ts" setup>
import type { MaybeMyIconName, MyIconName } from '#my-icons';
import { isContentType } from '@erudit-js/cog/schema';

const { result } = defineProps<{ result: SearchEntry }>();

const ELEMENT_PREFIX = 'element:';
const isElementCategory = result.category?.startsWith(ELEMENT_PREFIX);

const immediateIcon: MaybeMyIconName = (() => {
    if (isElementCategory) {
        return loadingSvg;
    }

    if (isContentType(result.category)) {
        return ICONS[result.category];
    }

    switch (result.category) {
        case 'contributors':
            return 'user';
        default:
            return '__missing';
    }
})();

const iconKey = ref(0);
const icon = ref<MaybeMyIconName>(immediateIcon);

watch(icon, () => {
    iconKey.value += 1;
});

async function requestElementIcon(elementName: string) {
    try {
        icon.value = await getElementIcon(elementName);
    } catch {
        icon.value = '__missing' satisfies MyIconName;
    }
}

if (isElementCategory) {
    const elementName = result.category!.slice(ELEMENT_PREFIX.length);
    requestElementIcon(elementName);
}
</script>

<template>
    <li>
        <AsideListItem :to="result.link">
            <div
                class="group p-normal text-text-muted hocus:text-text text-sm
                    transition-[color]"
            >
                <div class="gap-normal flex">
                    <div class="relative h-[1em] w-[1em]">
                        <TransitionFade>
                            <MaybeMyIcon
                                :name="icon"
                                :key="iconKey"
                                class="absolute top-[1px] left-0"
                            />
                        </TransitionFade>
                    </div>
                    <div>{{ result.title }}</div>
                </div>
                <div>
                    <div
                        v-if="result.description"
                        class="text-text-dimmed pt-small text-xs"
                    >
                        {{ result.description }}
                    </div>
                    <div
                        v-if="result.synonyms?.length"
                        class="pt-small flex flex-wrap gap-[8px] text-xs"
                    >
                        <span
                            v-for="synonym in result.synonyms"
                            class="text-text-dimmed group-hocus:bg-bg-aside
                                rounded bg-neutral-200 px-[5px] py-[3px]
                                transition-[background] dark:bg-neutral-800"
                        >
                            {{ synonym }}
                        </span>
                    </div>
                    <div
                        v-if="result.location"
                        class="text-text-dimmed pt-small gap-small flex
                            items-center text-xs italic"
                    >
                        <MyIcon name="arrow/up-to-right" class="shrink-0" />
                        {{ result.location }}
                    </div>
                </div>
            </div>
        </AsideListItem>
    </li>
</template>
