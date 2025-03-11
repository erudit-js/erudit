import { BlockNode, type DefineElementSchema } from '@bitran-js/core';

export const aliasesName = 'aliases';

export type Aliases = Record<string, string>;

export type AliasesSchema = DefineElementSchema<{
    ParseData: Aliases;
}>;

export class AliasesNode extends BlockNode<AliasesSchema> {}

export function NO_ALIASES(): Aliases {
    return {};
}

export function tryReplaceAlias(target: string, aliases: Aliases): string {
    if (!target.match(/^~\w+$/)) return target;

    const alias = target.substring(1);
    const replacement = aliases[alias];

    if (!replacement) throw new Error(`Unknown alias "~${alias}"!`);

    return replacement;
}

export function mergeAliases(documentAliases: Aliases, blockAliases: Aliases) {
    for (const [aliasName, aliasTarget] of Object.entries(blockAliases)) {
        if (documentAliases[aliasName]) {
            throw new Error(
                `Alias "${aliasName}" already defined in document!`,
            );
        }

        documentAliases[aliasName] = aliasTarget;
    }
}
