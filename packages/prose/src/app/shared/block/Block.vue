<script lang="ts" setup>
import {
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watch,
  watchEffect,
} from 'vue';
import { useFloating, autoUpdate, offset, shift } from '@floating-ui/vue';

import { useProseContext } from '../../composables/context.js';
import { useElementIcon } from '../../composables/elementIcon.js';
import {
  useIsAnchor,
  useJumpToAnchor,
  useResolveAnchor,
} from '../../composables/anchor.js';
import AsideMenu from './AsideMenu.vue';
import { useFormatTextState } from '../../composables/formatText.js';
import type { BlockProseElement } from 'tsprose';

const { element } = defineProps<{ element: BlockProseElement }>();
const { EruditIcon, EruditTransition, setHtmlIds } = useProseContext();
const elementIcon = await useElementIcon(element);

const formatTextState = useFormatTextState();
// Reset quote state making sure any opened quote does not leak outside
formatTextState.quote = 'closed';

const blockElement = useTemplateRef('block');
const asideElement = useTemplateRef('aside');
const asideMenuElement = useTemplateRef('asideMenu');
const hover = ref(false);
const menuVisible = ref(false);

const { floatingStyles: floatingMenuStyle } = useFloating(
  asideElement,
  asideMenuElement,
  {
    whileElementsMounted: autoUpdate,
    placement: 'right-start',
    strategy: 'fixed',
    middleware: [offset(10), shift({ rootBoundary: 'viewport' })],
  },
);

const outsideClickHandler = (e: MouseEvent) => {
  if (!menuVisible.value) return;
  const aside = asideElement.value;
  if (!aside) return;
  if (aside.contains(e.target as Node)) return;
  menuVisible.value = false;
};

const isAnchor = useIsAnchor(element);
const jumpToAnchor = useJumpToAnchor();
const resolveAnchor = useResolveAnchor();

/**
 * Waits for the element's position to be stable in the viewport before resolving the anchor.
 * Stability is defined as the element remaining in the same position for some duration.
 * If the element moves during this period, the timer is reset.
 *
 * @param element - The DOM element to monitor for position stability
 * @param onStable - Callback to execute once the element is stable
 * @param onCleanup - Vue's cleanup callback to register cleanup handlers
 */
const waitForStablePosition = (
  element: HTMLElement,
  onStable: () => void,
  onCleanup: (fn: () => void) => void,
) => {
  const stableDuration = 300;

  let lastPosition = { top: 0, left: 0 };
  let stableTimer: number | undefined;
  let animationFrameId: number | undefined;
  let resolved = false;

  /**
   * Continuously checks if the element's position has changed.
   * If a change is detected, the stability timer is reset.
   * Uses requestAnimationFrame for efficient, synchronized position monitoring.
   */
  const checkStability = () => {
    if (resolved) return;

    const rect = element.getBoundingClientRect();
    const currentPosition = { top: rect.top, left: rect.left };

    // Detect position changes and reset stability timer
    if (
      lastPosition.top !== currentPosition.top ||
      lastPosition.left !== currentPosition.left
    ) {
      lastPosition = currentPosition;
      clearTimeout(stableTimer);

      // Start new 200ms countdown for stability
      stableTimer = window.setTimeout(() => {
        resolved = true;
        onStable();
      }, stableDuration);
    }

    // Continue monitoring on next frame
    animationFrameId = requestAnimationFrame(checkStability);
  };

  // Initialize tracking with current position
  const initialRect = element.getBoundingClientRect();
  lastPosition = { top: initialRect.top, left: initialRect.left };

  // Start initial stability timer
  stableTimer = window.setTimeout(() => {
    resolved = true;
    cancelAnimationFrame(animationFrameId!);
    onStable();
  }, stableDuration);

  // Begin position monitoring
  animationFrameId = requestAnimationFrame(checkStability);

  // Cleanup timers and animation frames when effect is disposed
  onCleanup(() => {
    clearTimeout(stableTimer);
    if (animationFrameId !== undefined) {
      cancelAnimationFrame(animationFrameId);
    }
  });
};

watch(menuVisible, (visible) => {
  if (visible) {
    document.addEventListener('click', outsideClickHandler);
  } else {
    document.removeEventListener('click', outsideClickHandler);
  }
});

onMounted(() => {
  watchEffect(async (onCleanup) => {
    if (isAnchor.value) {
      jumpToAnchor(blockElement.value!);
      waitForStablePosition(
        blockElement.value!,
        () => {
          jumpToAnchor(blockElement.value!);
          resolveAnchor();
        },
        onCleanup,
      );
    }
  });

  hover.value = blockElement.value!.matches(':hover');

  blockElement.value!.addEventListener('mouseenter', () => {
    hover.value = true;
  });

  blockElement.value!.addEventListener('mouseleave', () => {
    hover.value = false;
  });
});

onBeforeUnmount(() => {
  document.removeEventListener('click', outsideClickHandler);
});
</script>

<template>
  <div
    ref="block"
    :id="setHtmlIds ? element.id : undefined"
    :class="[$style.block, 'scroll-mt-big pr-(--proseAsideWidth)']"
  >
    <div :class="[$style.blockAbove, 'h-(--proseGap)']"></div>

    <div class="relative">
      <!-- Block Aside -->
      <aside
        ref="aside"
        @click="menuVisible = !menuVisible"
        class="group/aside absolute top-0 left-0 h-full w-(--proseAsideWidth)
          cursor-pointer"
      >
        <!-- Aside Background -->
        <div
          class="micro:rounded-sm group-hocus/aside:bg-bg-accent absolute top-0
            left-0 h-full w-full bg-transparent transition-[background]"
        ></div>
        <!-- Aside Icon -->
        <div class="sticky top-0">
          <EruditTransition mode="out-in">
            <div v-if="hover" :key="elementIcon">
              <EruditIcon
                :name="elementIcon"
                class="text-text-dimmed group-hocus/aside:text-text m-auto
                  mt-0.5 aspect-square w-[80%] transition-[color]"
              />
            </div>
          </EruditTransition>
        </div>
        <!-- Aside Menu -->
        <EruditTransition>
          <div
            ref="asideMenu"
            :style="floatingMenuStyle"
            v-if="menuVisible"
            @click.stop
            class="z-10 cursor-auto"
          >
            <AsideMenu :element />
          </div>
        </EruditTransition>
      </aside>

      <!-- Block Content -->
      <main class="relative ml-(--proseAsideWidth)">
        <slot></slot>
        <!-- Anchor Overlay -->
        <EruditTransition>
          <div v-if="isAnchor">
            <div
              class="bg-brand animate-fade-out pointer-events-none absolute
                -top-(--overlayPadding) -right-(--overlayPadding)
                -bottom-(--overlayPadding) -left-(--overlayPadding) touch-none
                rounded opacity-0 shadow-[0_0_18px_1px_var(--color-brand)]
                [--overlayPadding:5px]"
            ></div>
          </div>
        </EruditTransition>
      </main>
    </div>

    <div :class="[$style.blockBelow, 'h-(--proseGap)']"></div>
  </div>
</template>

<style module>
/* Always hide corresponding block gaps for frist/last blocks. */

.block:first-child > .blockAbove {
  display: none !important;
}

.block:last-child > .blockBelow {
  display: none !important;
}

/* Hiding bottom block gap by default, to compensate next block's top gap. */

.blockBelow {
  display: none;
}

/* When hover/focus show block bottom gap to increase hoverable area and hide next block's top gap so no gap duplication happens. */

.block:hover:has(+ .block) > .blockBelow,
.block:focus:has(+ .block) > .blockBelow {
  display: block;
}

.block:hover + .block > .blockAbove,
.block:focus + .block > .blockAbove {
  display: none;
}
</style>
