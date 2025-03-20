import type { PreRenderData } from '@bitran-js/transpiler';

export interface StringBitranContent {
    biCode: string;
    preRenderData?: Record<string, PreRenderData>;
}
