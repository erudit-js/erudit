export type BitranAliases = Record<string, string>;

export function NO_ALIASES(): BitranAliases {
    return {};
}

export function tryReplaceAlias(
    target: string,
    aliases: BitranAliases,
): string {
    if (!target.match(/^~\S+$/)) return target;

    const alias = target.substring(1);
    const replacement = aliases[alias];

    if (!replacement) throw new Error(`Unknown alias "~${alias}"!`);

    return replacement;
}

export function mergeAliases(
    documentAliases: BitranAliases,
    blockAliases: BitranAliases,
) {
    for (const [aliasName, aliasTarget] of Object.entries(blockAliases)) {
        if (documentAliases[aliasName]) {
            throw new Error(
                `Alias "${aliasName}" already defined in document!`,
            );
        }

        documentAliases[aliasName] = aliasTarget;
    }
}
