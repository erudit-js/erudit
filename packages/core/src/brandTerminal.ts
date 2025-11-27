import gradient from 'gradient-string';

import { brandColors, brandLogotype } from './brand.js';

export const brandColorLogotype =
    gradient(brandColors).multiline(brandLogotype);
export const brandColorTitle = gradient(brandColors)('Erudit');
