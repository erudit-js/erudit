<script lang="ts" setup>
import type { ResolvedTocItem } from '@erudit-js/prose';

import TocItem from './TocItem.vue';

const props = defineProps<{ toc?: ResolvedTocItem[] }>();
const phrase = await usePhrases('no_toc');

/**
 * Active heading IDs (provided to children)
 */
const activeHeadingIds = shallowRef<Set<string>>(new Set());
provide('activeHeadingIds', activeHeadingIds);

/**
 * Collect all heading items from TOC tree (DFS)
 */
function collectHeadings(items: ResolvedTocItem[]): ResolvedTocItem[] {
  const result: ResolvedTocItem[] = [];

  const walk = (item: ResolvedTocItem) => {
    if (item.type === 'heading') {
      result.push(item);
      item.children.forEach(walk);
    }
  };

  items.forEach(walk);
  return result;
}

/**
 * Find the last heading above the viewport (initial load fix)
 */
function findLastHeadingAboveViewport(
  elements: { id: string; el: HTMLElement }[],
): string | null {
  const scrollY = window.scrollY;
  let last: string | null = null;

  for (const { id, el } of elements) {
    if (el.offsetTop < scrollY) {
      last = id;
    } else {
      break;
    }
  }

  return last;
}

onMounted(() => {
  if (!props.toc) return;

  /**
   * 1️⃣ Collect headings
   */
  const headings = collectHeadings(props.toc);

  /**
   * 2️⃣ Resolve DOM elements (once)
   */
  const elements = headings
    .map((h) => ({
      id: h.elementId,
      el: document.getElementById(h.elementId),
    }))
    .filter((h): h is { id: string; el: HTMLElement } => !!h.el);

  if (elements.length === 0) return;

  /**
   * 3️⃣ Handles page load / refresh in middle of document
   */
  const visibleIds = new Set<string>();
  let lastAboveViewportId = findLastHeadingAboveViewport(elements);

  if (lastAboveViewportId) {
    activeHeadingIds.value = new Set([lastAboveViewportId]);
  }

  /**
   * 4️⃣ IntersectionObserver
   */
  const observer = new IntersectionObserver(
    (entries) => {
      let changed = false;

      for (const entry of entries) {
        const id = entry.target.id;

        if (entry.isIntersecting) {
          if (!visibleIds.has(id)) {
            visibleIds.add(id);
            changed = true;
          }
        } else {
          if (visibleIds.delete(id)) {
            changed = true;
          }

          // Track last heading above viewport
          if (entry.boundingClientRect.top < 0) {
            lastAboveViewportId = id;
          } else {
            // If heading is below viewport and it was the last one above, clear it
            if (lastAboveViewportId === id) {
              lastAboveViewportId = null;
            }
          }
        }
      }

      if (!changed) return;

      const next = new Set<string>();

      if (visibleIds.size > 0) {
        visibleIds.forEach((id) => next.add(id));
      } else if (lastAboveViewportId) {
        // Verify the heading is still above viewport before using it
        const lastEl = document.getElementById(lastAboveViewportId);
        if (lastEl && lastEl.getBoundingClientRect().top < 0) {
          next.add(lastAboveViewportId);
        }
      }

      activeHeadingIds.value = next;
    },
    {
      root: null,
    },
  );

  /**
   * 5️⃣ Observe all headings
   */
  elements.forEach(({ el }) => observer.observe(el));

  /**
   * 6️⃣ Re-sync active heading when ?element navigation jumps past headings.
   * IntersectionObserver only fires on gradual scrolls; programmatic
   * scrollIntoView skips headings without triggering intersection events.
   */
  const route = useRoute();
  watch(
    () => route.query.element,
    async (elementId) => {
      if (!elementId) return;
      // Wait for scrollIntoView to finish (it's synchronous but DOM
      // layout needs a tick + frame to reflect the new scrollY)
      await nextTick();
      requestAnimationFrame(() => {
        lastAboveViewportId = findLastHeadingAboveViewport(elements);
        visibleIds.clear();
        activeHeadingIds.value = lastAboveViewportId
          ? new Set([lastAboveViewportId])
          : new Set();
      });
    },
  );

  /**
   * 7️⃣ Cleanup
   */
  onUnmounted(() => {
    observer.disconnect();
  });
});
</script>

<template>
  <div v-if="toc">
    <TreeContainer>
      <TocItem
        v-for="tocItem of toc"
        :key="tocItem.elementId"
        :item="tocItem"
        :level="0"
      />
    </TreeContainer>
  </div>
  <AsidePlainMessage v-else :text="phrase.no_toc" />
</template>
