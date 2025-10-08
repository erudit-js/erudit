import {
    computed,
    inject,
    onMounted,
    shallowRef,
    watch,
    type InjectionKey,
    type Ref,
} from 'vue';

import type { ParsedElement } from '../../../element';
import type { ElementSchemaAny } from '../../../schema';

export interface AnchorState {
    jumpedToAnchor: Ref<boolean>;
    anchorElement: Ref<ParsedElement<ElementSchemaAny> | undefined>;
    containsAnchorElements: Ref<Set<ParsedElement<ElementSchemaAny>>>;
}

export const anchorStateSymbol = Symbol() as InjectionKey<AnchorState>;

export function useIsAnchor(element: ParsedElement<ElementSchemaAny>) {
    const { anchorElement } = inject(anchorStateSymbol)!;

    return computed(() => {
        return anchorElement.value?.domId === element.domId;
    });
}

export function useContainsAnchor(element: ParsedElement<ElementSchemaAny>) {
    const { containsAnchorElements } = inject(anchorStateSymbol)!;

    return computed(() => {
        return containsAnchorElements.value.has(element);
    });
}

export function useArrayContainsAnchor(
    elements: ParsedElement<ElementSchemaAny>[],
) {
    const { containsAnchorElements } = inject(anchorStateSymbol)!;

    return computed(() => {
        const i = elements.findIndex((el) =>
            containsAnchorElements.value.has(el),
        );
        return i !== -1 ? i : undefined;
    });
}

export function useJumpToAnchor() {
    const { jumpedToAnchor } = inject(anchorStateSymbol)!;

    return (element: HTMLElement) => {
        if (jumpedToAnchor.value) {
            return;
        }

        element.scrollIntoView({
            block: 'center',
        });

        jumpedToAnchor.value = true;
    };
}

export function useAnchorState(
    hashId: Ref<string | undefined>,
    element: ParsedElement<ElementSchemaAny>,
): AnchorState {
    const jumpedToAnchor = shallowRef(false);
    const anchorElement = shallowRef<ParsedElement<ElementSchemaAny>>();
    const containsAnchorElements = shallowRef<
        Set<ParsedElement<ElementSchemaAny>>
    >(new Set());

    onMounted(() => {
        watch(
            hashId,
            () => {
                jumpedToAnchor.value = false;
                anchorElement.value = undefined;
                containsAnchorElements.value = new Set();

                if (!hashId.value) {
                    return;
                }

                const stack: ParsedElement<ElementSchemaAny>[] = [];

                const dfs = (
                    _element: ParsedElement<ElementSchemaAny>,
                ): boolean => {
                    stack.push(_element);

                    if (_element.domId === hashId.value) {
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
            },
            { immediate: true },
        );
    });

    return {
        jumpedToAnchor,
        anchorElement,
        containsAnchorElements,
    };
}
