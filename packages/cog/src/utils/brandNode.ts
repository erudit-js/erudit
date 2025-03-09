import gradient from 'gradient-string';

import { brandColors, brandLogotype, brandTitle } from './brand';

export const brandColorLogotype =
    gradient(brandColors).multiline(brandLogotype);
export const brandColorTitle = gradient(brandColors)(brandTitle);
