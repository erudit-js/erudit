import {
    computed,
    inject,
    onMounted,
    shallowRef,
    watch,
    type InjectionKey,
    type Ref,
} from 'vue';
import type { AnySchema, ProseElement } from '@jsprose/core';

export interface AnchorState {
    anchorResolving: Ref<boolean>;
    jumpedToAnchor: Ref<boolean>;
    anchorElement: Ref<ProseElement<AnySchema> | undefined>;
    containsAnchorElements: Ref<Set<ProseElement<AnySchema>>>;
}

export function useAnchorState(
    hashId: Ref<string | undefined>,
    element: ProseElement<AnySchema>,
): AnchorState {
    const anchorResolving = shallowRef(false);
    const jumpedToAnchor = shallowRef(false);
    const anchorElement = shallowRef<ProseElement<AnySchema>>();
    const containsAnchorElements = shallowRef<Set<ProseElement<AnySchema>>>(
        new Set(),
    );

    onMounted(() => {
        watch(
            hashId,
            () => {
                anchorResolving.value = true;
                jumpedToAnchor.value = false;
                anchorElement.value = undefined;
                containsAnchorElements.value = new Set();

                if (!hashId.value) {
                    // No hash, no anchor to resolve
                    anchorResolving.value = false;
                    return;
                }

                const stack: ProseElement<AnySchema>[] = [];

                const dfs = (_element: ProseElement<AnySchema>): boolean => {
                    stack.push(_element);

                    if (_element.id === hashId.value) {
                        anchorElement.value = _element;
                        containsAnchorElements.value = new Set(
                            stack.slice(0, -1),
                        );
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
        jumpedToAnchor,
        anchorElement,
        containsAnchorElements,
    };
}

export const anchorStateSymbol = Symbol() as InjectionKey<AnchorState>;

export function useIsAnchor(element: ProseElement<AnySchema>) {
    const { anchorElement } = inject(anchorStateSymbol)!;

    return computed(() => {
        return anchorElement.value && anchorElement.value.id === element.id;
    });
}

export function useContainsAnchor(element: ProseElement<AnySchema>) {
    const { containsAnchorElements } = inject(anchorStateSymbol)!;

    return computed(() => {
        return containsAnchorElements.value.has(element);
    });
}

export function useArrayContainsAnchor(elements: ProseElement<AnySchema>[]) {
    const { containsAnchorElements } = inject(anchorStateSymbol)!;

    return computed(() => {
        const i = elements.findIndex((el) =>
            containsAnchorElements.value.has(el),
        );
        return i !== -1 ? i : undefined;
    });
}

export function useAnchorResolving() {
    const { anchorResolving } = inject(anchorStateSymbol)!;
    return anchorResolving;
}

export function useResolveAnchor() {
    const { jumpedToAnchor, anchorResolving } = inject(anchorStateSymbol)!;

    return (element: HTMLElement) => {
        if (!jumpedToAnchor.value) {
            element.scrollIntoView({
                block: 'center',
            });
        }

        jumpedToAnchor.value = true;
        anchorResolving.value = false;
    };
}
