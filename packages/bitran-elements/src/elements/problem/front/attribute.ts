import type { ProblemAtrribute } from '../shared';

import appliedIcon from '../assets/attributes/applied.svg?raw';
import methodIcon from '../assets/attributes/method.svg?raw';
import interIcon from '../assets/attributes/inter.svg?raw';
import prettyIcon from '../assets/attributes/pretty.svg?raw';

export interface AttributeFront {
    icon: string;
}

export const attributeFront: Record<ProblemAtrribute, AttributeFront> = {
    applied: {
        icon: appliedIcon,
    },
    method: {
        icon: methodIcon,
    },
    inter: {
        icon: interIcon,
    },
    pretty: {
        icon: prettyIcon,
    },
};
