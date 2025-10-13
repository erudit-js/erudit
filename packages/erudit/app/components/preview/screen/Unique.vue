<script lang="ts" setup>
const { request } = defineProps<{ request: PreviewRequestUnique }>();

const uniqueContent = await $fetch<PreviewContentUnique>(
    `/api/preview/contentUnique/${request.contentPathUniqueSlug}` + '.json',
    {
        responseType: 'json',
    },
);

const elementIcon = await getElementIcon(uniqueContent.element.name);
const elementPhrase = await getElementPhrase(uniqueContent.element.name);

const main = uniqueContent.element.title || elementPhrase.element_name;
const secondary = (() => {
    if (!uniqueContent.element.title) {
        return uniqueContent.documentTitle;
    }

    return `${elementPhrase.element_name} • ${uniqueContent.documentTitle}`;
})();

const isHeadingUnique = Boolean(uniqueContent.headingStack);
const element = uniqueContent.headingStack ?? uniqueContent.element;
</script>

<template>
    <PreviewScreen
        :icon="elementIcon"
        :main
        :secondary
        :link="uniqueContent.href"
    >
        <div
            class="nice-scrollbars relative max-h-[inherit] overflow-auto
                py-(--_pMainY)"
        >
            <Prose
                :element
                :storage="uniqueContent.storage"
                :urlPath="'/' + uniqueContent.href.split('#')[0]"
                :useHash="false"
            />
            <div
                v-if="isHeadingUnique"
                class="to-bg-main pointer-events-none absolute bottom-0 left-0
                    h-full w-full touch-none bg-linear-to-b from-transparent"
            ></div>
        </div>
    </PreviewScreen>
</template>
