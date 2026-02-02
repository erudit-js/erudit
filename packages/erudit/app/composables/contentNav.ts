const contentNavGlobalKey = 'contentNav-global';

export const contentNavSymbol = Symbol() as InjectionKey<{
  shortContentId: ComputedRef<string | undefined>;
  shortBookId: ComputedRef<string | undefined>;
  showBookNav: Ref<boolean>;
}>;
