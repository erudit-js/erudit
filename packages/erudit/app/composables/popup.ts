import type { TemplateRef } from 'vue';
import { useFloating, type UseFloatingOptions } from '@floating-ui/vue';

export function usePopup(
  containerElement: TemplateRef<HTMLElement>,
  toggleElement: TemplateRef<HTMLElement>,
  popupElement: TemplateRef<HTMLElement>,
  options?: UseFloatingOptions,
) {
  const showDelay = 400;
  const popupVisible = ref(false);
  const showTimeout = ref<ReturnType<typeof setTimeout>>();
  const { floatingStyles: popupStyles } = useFloating(
    containerElement,
    popupElement,
    options,
  );

  function showPopup() {
    showTimeout.value = setTimeout(() => {
      popupVisible.value = true;
    }, showDelay);
  }

  function hidePopup() {
    if (showTimeout.value) {
      clearTimeout(showTimeout.value);
    }
    popupVisible.value = false;
  }

  const contextMenuBreaker = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  function enableContextMenuBreaker() {
    if (toggleElement.value) {
      toggleElement.value.addEventListener('contextmenu', contextMenuBreaker);
    }
  }
  function disableContextMenuBreaker() {
    if (toggleElement.value) {
      toggleElement.value.removeEventListener(
        'contextmenu',
        contextMenuBreaker,
      );
    }
  }

  const scrollBreaker = () => {
    // Break showing wait if scrolling occurs
    if (showTimeout.value) {
      clearTimeout(showTimeout.value);
    }
    // But do not hide already showing popup.
    // It is okay to scroll after the popup is already shown.
  };
  function enableScrollBreaker() {
    addEventListener('scroll', scrollBreaker);
    addEventListener('resize', scrollBreaker);
  }
  function disableScrollBreaker() {
    removeEventListener('scroll', scrollBreaker);
    removeEventListener('resize', scrollBreaker);
  }

  onMounted(() => {
    if (containerElement.value) {
      containerElement.value.addEventListener('mouseenter', showPopup);
      containerElement.value.addEventListener('mouseleave', hidePopup);
    }

    if (toggleElement.value) {
      toggleElement.value.addEventListener('touchstart', (e) => {
        if (popupVisible.value) {
          // Want to hide
          disableScrollBreaker();
          disableContextMenuBreaker();
          hidePopup();
        } else {
          // Want to show
          enableScrollBreaker();
          enableContextMenuBreaker();
          showPopup();
        }
      });

      toggleElement.value.addEventListener('touchend', (e) => {
        if (showTimeout.value) {
          clearTimeout(showTimeout.value);
        }
      });
    }
  });

  onUnmounted(() => {
    if (showTimeout.value) {
      clearTimeout(showTimeout.value);
    }
  });

  return {
    popupVisible,
    popupStyles,
    showPopup,
    hidePopup,
  };
}
