import type { BitranElements } from './element';

export type EruditBitranConfig = {
    elements: BitranElements;
    toc: string[];

    /**
     * TODO!
     * Groups of elements that are tracked on site and display on site index and book pages and so on.
     *
     * Example:
     * tracked: {
     *     term: {
     *        elements: ['definition', 'axiom'],
              title: 'Термин',
              toc: true,
              search: false,
              color: '#E0E0E0',
     *     }
     * }
     */
};

export function defineBitranConfig(
    config: Partial<EruditBitranConfig>,
): Partial<EruditBitranConfig> {
    return config;
}
