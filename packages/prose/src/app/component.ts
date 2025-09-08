import { defineAsyncComponent, type Component } from 'vue';

export type ElementComponentRaw = () => Promise<{ default: Component }>;
export type ElementComponent = () => Promise<Component>;

export function resolveElementComponent(
    vueComponentModule: ElementComponentRaw,
): ElementComponent {
    return async () => defineAsyncComponent(vueComponentModule);
}
