import {
  computed,
  inject,
  onMounted,
  shallowRef,
  watch,
  type InjectionKey,
  type Ref,
} from 'vue';
import type { Schema, ToProseElement } from 'tsprose';

export interface AnchorState {
  anchorResolving: Ref<boolean>;
  allowJumpToAnchor: Ref<boolean>;
  anchorElement: Ref<ToProseElement<Schema> | undefined>;
  containsAnchorElements: Ref<Set<ToProseElement<Schema>>>;
}

export function useAnchorState(
  hashId: Ref<string | undefined>,
  element: ToProseElement<Schema>,
): AnchorState {
  const anchorResolving = shallowRef(false);
  const allowJumpToAnchor = shallowRef(false);
  const anchorElement = shallowRef<ToProseElement<Schema>>();
  const containsAnchorElements = shallowRef<Set<ToProseElement<Schema>>>(
    new Set(),
  );

  onMounted(() => {
    watch(
      hashId,
      () => {
        anchorResolving.value = true;
        allowJumpToAnchor.value = true;
        anchorElement.value = undefined;
        containsAnchorElements.value = new Set();

        if (!hashId.value) {
          // No hash, no anchor to resolve
          anchorResolving.value = false;
          return;
        }

        const stack: ToProseElement<Schema>[] = [];

        const dfs = (_element: ToProseElement<Schema>): boolean => {
          stack.push(_element);

          if (_element.id === hashId.value) {
            anchorElement.value = _element;
            containsAnchorElements.value = new Set(stack.slice(0, -1));
            stack.pop();
            return true;
          }

          const children = _element.children || [];
          for (const child of children) {
            if (dfs(child)) {
              stack.pop();
              return true;
            }
          }

          stack.pop();
          return false;
        };

        dfs(element);

        if (!anchorElement.value) {
          // There is a hash, but it targets somewhere else, not this element tree
          anchorResolving.value = false;
        }
      },
      { immediate: true },
    );
  });

  return {
    anchorResolving,
    allowJumpToAnchor,
    anchorElement,
    containsAnchorElements,
  };
}

export const anchorStateSymbol = Symbol() as InjectionKey<AnchorState>;

export function useIsAnchor(element: ToProseElement<Schema>) {
  const { anchorElement } = inject(anchorStateSymbol)!;

  return computed(() => {
    return anchorElement.value && anchorElement.value.id === element.id;
  });
}

export function useContainsAnchor(element: ToProseElement<Schema>) {
  const { containsAnchorElements } = inject(anchorStateSymbol)!;

  return computed(() => {
    return containsAnchorElements.value.has(element);
  });
}

export function useArrayContainsAnchor(elements: ToProseElement<Schema>[]) {
  const { containsAnchorElements } = inject(anchorStateSymbol)!;

  return computed(() => {
    const i = elements.findIndex((el) => containsAnchorElements.value.has(el));
    return i !== -1 ? i : undefined;
  });
}

export function useAnchorResolving() {
  const { anchorResolving } = inject(anchorStateSymbol)!;
  return anchorResolving;
}

export function useJumpToAnchor() {
  const { allowJumpToAnchor } = inject(anchorStateSymbol)!;

  return (element: HTMLElement) => {
    if (allowJumpToAnchor.value) {
      element.scrollIntoView({
        block: 'center',
      });
    }
  };
}

export function useResolveAnchor() {
  const { allowJumpToAnchor, anchorResolving } = inject(anchorStateSymbol)!;

  return () => {
    allowJumpToAnchor.value = false;
    anchorResolving.value = false;
  };
}
