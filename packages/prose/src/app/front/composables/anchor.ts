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
    anchorElement: Ref<ParsedElement<ElementSchemaAny> | undefined>;
    containsAnchorElements: Ref<Set<ParsedElement<ElementSchemaAny>>>;
}

export const anchorStateSymbol = Symbol() as InjectionKey<AnchorState>;

export function useIsAnchor(element: ParsedElement<ElementSchemaAny>) {
    const { anchorElement } = inject(anchorStateSymbol)!;

    return computed(() => {
        return element.domId && anchorElement.value?.domId === element.domId;
    });
}

export function useContainsAnchor(element: ParsedElement<ElementSchemaAny>) {
    const { containsAnchorElements } = inject(anchorStateSymbol)!;

    return computed(() => {
        return element.domId && containsAnchorElements.value.has(element);
    });
}

export function useAnchorState(
    hashId: Ref<string | undefined>,
    element: ParsedElement<ElementSchemaAny>,
) {
    const anchorElement = shallowRef<ParsedElement<ElementSchemaAny>>();
    const containsAnchorElements = shallowRef<
        Set<ParsedElement<ElementSchemaAny>>
    >(new Set());

    onMounted(() => {
        watch(
            hashId,
            () => {
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
        anchorElement,
        containsAnchorElements,
    };
}
