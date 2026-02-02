import type { Component } from 'vue';

export type ElementComponentRaw = () => Promise<{ default: Component }>;
export type ElementComponent = () => Promise<Component>;

export function resolveElementComponent(
  componentRaw: ElementComponentRaw,
): ElementComponent {
  return async () => {
    const componentModule = await componentRaw();
    return componentModule.default;
  };
}
