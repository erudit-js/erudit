import type { ElementPhrases } from '../../app/language/element.js';
import type { ProblemAttribute, ProblemLevel } from './shared.js';

export type ProblemPhrases = ElementPhrases<
  {
    [K in `level.${ProblemLevel}`]: string;
  } & {
    [K in
      | `attribute.${ProblemAttribute}`
      | `attribute_explain.${ProblemAttribute}`]: string;
  } & {
    level_hint: string;
    action_hint: string;
    action_solution: string;
    action_answer: string;
    action_note: string;
    action_check: string;
    action_generate: string;
    seed_explain: string;
  }
>;
