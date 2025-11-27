import { defineEruditProseCoreElements } from '../../coreElement.js';
import { problemCoreElement } from './problem.js';
import {
    problemAnswer,
    problemCheckCoreElement,
    problemDescriptionCoreElement,
    problemHintCoreElement,
    problemNote,
    problemSolution,
} from './problemContent.js';
import { problemsCoreElement, subProblemCoreElement } from './problems.js';

export default defineEruditProseCoreElements(
    problemDescriptionCoreElement,
    problemHintCoreElement,
    problemAnswer.coreElement,
    problemSolution.coreElement,
    problemNote.coreElement,
    problemCheckCoreElement,
    //
    problemCoreElement,
    subProblemCoreElement,
    problemsCoreElement,
);
