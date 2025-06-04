<script lang="ts" setup>
import { headingName } from '@erudit-js/bitran-elements/heading/shared';

import type { TocItem } from '@erudit/shared/bitran/toc';
import { injectAsideData } from '@app/scripts/aside/minor/state';
import type { AsideMinorTopic } from '@shared/aside/minor';

import TopicTocItem from './TopicTocItem.vue';

interface RuntimeTocItem extends TocItem {
    /**
     * * `0` — Not active
     * * `1` — Active for `window` events
     * * `2` — Active for Intersection Observer and currently in viewport
     */
    _active: 0 | 1 | 2;
    _position: number;
}

type RuntimeToc = RuntimeTocItem[];

const topicData = injectAsideData<AsideMinorTopic>();
const runtimeToc = ref<RuntimeToc>([]);
const tocStateKey = ref(0);
const phrase = await usePhrases('empty_toc');

watch(topicData, setupRuntimeToc);
setupRuntimeToc();

function setupRuntimeToc(): void {
    const _newToc: RuntimeToc = [];

    for (let i = 0; i < topicData.value.toc.length; i++) {
        _newToc.push({
            ...topicData.value.toc[i]!,
            _active: 0,
            _position: i,
        });
    }

    runtimeToc.value = _newToc;
    tocStateKey.value++;
}

//
// Live TOC
//

let observer: IntersectionObserver | null = null;
let id2TocItemIndex: Record<string, number> = {};

const windowEvents = ['DOMContentLoaded', 'load', 'resize', 'scroll'] as const;
let headings: RuntimeTocItem[] = [];
let closestAboveHeading: RuntimeTocItem | null = null;

function disableLiveToc(): void {
    // Skip if not in client-side
    if (import.meta.server) return;

    // Live TOC heading with `window` events
    for (const event of windowEvents) {
        window.removeEventListener(event, updateActiveTopHeading);
    }

    headings = [];
    closestAboveHeading = null;

    // Live TOC with Intersection Observer
    id2TocItemIndex = {};

    if (observer) {
        observer.disconnect();
        observer = null;
    }

    // Reset active state
    if (runtimeToc.value?.length) {
        for (const tocItem of runtimeToc.value) {
            tocItem._active = 0;
        }
    }
}

function enableLiveToc(): void {
    // Skip if not in client-side
    if (import.meta.server) return;
    if (!runtimeToc.value?.length) return;

    // Live TOC heading with `window` events
    headings = runtimeToc.value.filter(
        (item) => item.productName === headingName,
    );

    for (const event of windowEvents) {
        window.addEventListener(event, updateActiveTopHeading);
    }

    updateActiveTopHeading();

    // Live TOC with Intersection Observer
    observer = new IntersectionObserver(intersectionTrigger);
    id2TocItemIndex = {};

    for (const tocItem of runtimeToc.value) {
        const id = tocItem.id;
        id2TocItemIndex[id] = tocItem._position;
        const element = document.getElementById(id);
        if (element) {
            observer.observe(element);
        }
    }
}

function updateActiveTopHeading(): void {
    function getBottom(id: string): number {
        const defaultBottom = 1;
        const element = document.getElementById(id);
        return element ? element.getBoundingClientRect().bottom : defaultBottom;
    }

    if (closestAboveHeading) {
        closestAboveHeading._active = closestAboveHeading._active === 2 ? 2 : 0;
        closestAboveHeading = null;
    }

    if (!runtimeToc.value?.length || !headings.length) return;

    let topIndex = 0;
    let bottomIndex = headings.length;
    let targetIndex = 0;

    while (topIndex < bottomIndex) {
        const middleIndex = ((topIndex + bottomIndex) / 2) | 0;
        const middleHeading = headings[middleIndex]!;
        const middleHeadingTop = getBottom(middleHeading.id);

        if (middleHeadingTop <= 0) {
            targetIndex = middleIndex;
            topIndex = middleIndex + 1;
        } else {
            bottomIndex = middleIndex;
        }
    }

    closestAboveHeading = headings[targetIndex]!;
    if (closestAboveHeading && closestAboveHeading._active < 2) {
        closestAboveHeading._active =
            getBottom(closestAboveHeading.id) <= 0 ? 1 : 0;
    }
}

function intersectionTrigger(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
        const itemIndex = id2TocItemIndex[entry.target.id]!;
        const tocItem = runtimeToc.value?.[itemIndex];

        if (tocItem) {
            tocItem._active = entry.isIntersecting
                ? 2
                : tocItem._active === 1
                  ? 1
                  : 0;
        }
    }
}

watch(
    () => topicData.value.part,
    () => {
        disableLiveToc();
        nextTick().then(() => {
            enableLiveToc();
        });
    },
);

onMounted(() => {
    enableLiveToc();
});

onUnmounted(() => {
    disableLiveToc();
});
</script>

<template>
    <section :class="$style.topicToc">
        <TreeContainer v-if="runtimeToc?.length > 0" :key="tocStateKey">
            <TopicTocItem
                v-for="tocItem of runtimeToc"
                v-memo="[tocStateKey, tocItem.id, tocItem._active]"
                :active="!!tocItem._active"
                :tocItem
            />
        </TreeContainer>
        <div v-else :class="$style.tocEmpty">{{ phrase.empty_toc }}</div>
    </section>
</template>

<style lang="scss" module>
.topicToc {
    flex: 1;
    overflow: auto;
    @include scroll();
}

.tocEmpty {
    padding: var(--gap);
    text-align: center;
    color: var(--textMuted);
}
</style>
