import { problemCoreElement } from './problem.js';
import { problemCheckCoreElement } from './problemCheck.js';
import {
  problemAnswer,
  problemDescriptionCoreElement,
  problemHintCoreElement,
  problemNote,
  problemSectionCoreElement,
  problemSolution,
} from './problemContent.js';
import { problemsCoreElement, subProblemCoreElement } from './problems.js';

export default [
  problemCoreElement,
  subProblemCoreElement,
  problemsCoreElement,
  // Problem content
  problemDescriptionCoreElement,
  problemCheckCoreElement,
  problemHintCoreElement,
  problemSectionCoreElement,
  problemSolution.coreElement,
  problemAnswer.coreElement,
  problemNote.coreElement,
] as const;
