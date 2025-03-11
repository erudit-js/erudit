import {
    blockMathName,
    inlineMathName,
} from '@erudit-js/bitran-elements/math/shared';
import {
    blockMathElement,
    inlineMathElement,
} from '@erudit-js/bitran-elements/math/element';

export default defineBitranConfig({
    elements: {
        [blockMathName]: blockMathElement,
        [inlineMathName]: inlineMathElement,
    },
    //toc: ['fsdf']
    //toc: [blockMathName],
});
