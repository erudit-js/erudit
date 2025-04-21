import hintIcon from '../assets/actions/hint.svg?raw';
import solutionIcon from '../assets/actions/solution.svg?raw';
import answerIcon from '../assets/actions/answer.svg?raw';
import infoIcon from '../assets/actions/info.svg?raw';
import generateIcon from '../assets/actions/generate.svg?raw';

export interface ActionFront {
    icon: string;
}

export const actionFront = {
    hint: {
        icon: hintIcon,
    },
    solution: {
        icon: solutionIcon,
    },
    answer: {
        icon: answerIcon,
    },
    note: {
        icon: infoIcon,
    },
    generate: {
        icon: generateIcon,
    },
} as const satisfies Record<string, ActionFront>;
