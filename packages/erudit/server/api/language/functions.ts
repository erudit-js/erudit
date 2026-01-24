export default defineEventHandler(async () => {
    const strFunctions: Record<string, string> = {};

    for (const [funcName, funcValue] of Object.entries(
        ERUDIT.language.functions,
    )) {
        strFunctions[funcValue.name] = funcValue.toString();
    }

    return strFunctions;
});
