export const useScrollUp = () => {
  return useState<boolean>('scroll-up', () => true);
};

export function initScrollUpWatcher() {
  const scrollUp = useScrollUp();

  let layoutTimeout: any;
  let layoutEstablished = false;

  const route = useRoute();
  watch(
    () => route.path,
    () => {
      if (route.query.element) {
        return;
      }

      scrollUp.value = true;
      resetLayoutEstablished();
    },
  );

  function resetLayoutEstablished() {
    layoutEstablished = false;
    clearTimeout(layoutTimeout);
    layoutTimeout = setTimeout(() => {
      layoutEstablished = true;
    }, 150);
  }

  if (import.meta.client) {
    callOnce(async () => {
      let lastY = window.scrollY;
      let sumDelta = 0;
      let scrollTimeout: any;

      let lastTouchY: number | null = null;
      let touchSumDelta = 0;
      let touchTimeout: any;
      let touchNestedScroller: HTMLElement | null = null;

      let wheelSumDelta = 0;
      let wheelTimeout: any;

      const triggerDelta = 30;

      function findNestedScrollableAncestor(target: EventTarget | null) {
        if (!(target instanceof Element)) return null;

        let element: Element | null = target;
        while (
          element &&
          element !== document.documentElement &&
          element !== document.body
        ) {
          if (element instanceof HTMLElement) {
            const style = getComputedStyle(element);
            const overflowY = style.overflowY;
            const canScrollY =
              (overflowY === 'auto' ||
                overflowY === 'scroll' ||
                overflowY === 'overlay') &&
              element.scrollHeight > element.clientHeight + 1;

            if (canScrollY) return element;
          }

          element = element.parentElement;
        }

        return null;
      }

      function maxScrollY() {
        return document.documentElement.scrollHeight - window.innerHeight;
      }

      function isScrollable() {
        return maxScrollY() > 0;
      }

      onMounted(resetLayoutEstablished);

      addEventListener('resize', resetLayoutEstablished);

      addEventListener('scroll', () => {
        if (!layoutEstablished) {
          resetLayoutEstablished();
          return;
        }

        const currentY = window.scrollY;
        const delta = currentY - lastY;

        sumDelta += delta;

        if (sumDelta <= -triggerDelta || currentY <= 0) {
          scrollUp.value = true;
        } else if (sumDelta >= triggerDelta || currentY >= maxScrollY()) {
          scrollUp.value = false;
        }

        lastY = currentY;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          sumDelta = 0;
        }, 200);
      });

      addEventListener(
        'wheel',
        (e: WheelEvent) => {
          // If the page can scroll, the 'scroll' event above is the source of truth.
          // If it can't scroll (no scrollbar), interpret wheel delta as a virtual scroll.
          if (isScrollable()) return;

          // Normalize deltas a bit when the wheel is reporting in lines/pages.
          let deltaY = e.deltaY;
          if (e.deltaMode === 1) deltaY *= 16;
          else if (e.deltaMode === 2) deltaY *= window.innerHeight;

          wheelSumDelta += deltaY;

          if (wheelSumDelta <= -triggerDelta) {
            scrollUp.value = true;
          } else if (wheelSumDelta >= triggerDelta) {
            scrollUp.value = false;
          }

          clearTimeout(wheelTimeout);
          wheelTimeout = setTimeout(() => {
            wheelSumDelta = 0;
          }, 200);
        },
        { passive: true },
      );

      addEventListener(
        'touchstart',
        (e: TouchEvent) => {
          if (e.touches.length === 1) {
            lastTouchY = e.touches[0]!.clientY;
            touchNestedScroller = findNestedScrollableAncestor(e.target);
          }
        },
        { passive: true },
      );

      addEventListener(
        'touchmove',
        (e: TouchEvent) => {
          if (!layoutEstablished) {
            resetLayoutEstablished();
            return;
          }

          // If the touch started inside a nested scroll container, don't treat the gesture
          // as a page scroll. The nested container's own scroll should drive UI changes.
          if (touchNestedScroller) return;

          if (e.touches.length !== 1) return;

          const currentTouchY = e.touches[0]!.clientY;
          if (lastTouchY == null) lastTouchY = currentTouchY;

          const fingerDelta = currentTouchY - lastTouchY;
          const virtualScrollDelta = -fingerDelta;

          touchSumDelta += virtualScrollDelta;

          if (touchSumDelta <= -(isScrollable() ? triggerDelta : 1)) {
            scrollUp.value = true;
          } else if (touchSumDelta >= triggerDelta) {
            scrollUp.value = false;
          }

          lastTouchY = currentTouchY;

          clearTimeout(touchTimeout);
          touchTimeout = setTimeout(() => {
            touchSumDelta = 0;
          }, 200);
        },
        { passive: true },
      );

      addEventListener(
        'touchend',
        () => {
          lastTouchY = null;
          touchSumDelta = 0;
          touchNestedScroller = null;
        },
        { passive: true },
      );

      addEventListener(
        'touchcancel',
        () => {
          lastTouchY = null;
          touchSumDelta = 0;
          touchNestedScroller = null;
        },
        { passive: true },
      );
    });
  }
}
