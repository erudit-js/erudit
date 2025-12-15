import { defineEruditProseCoreElements } from '../../coreElement.js';
import { blockMathRegistryItem } from './block.js';
import { inlinerMathRegistryItem } from './inliner.js';
import { katexDependency } from './katex.js';

export default defineEruditProseCoreElements(
    {
        registryItem: inlinerMathRegistryItem,
        dependencies: katexDependency,
    },
    {
        registryItem: blockMathRegistryItem,
        dependencies: katexDependency,
    },
);
