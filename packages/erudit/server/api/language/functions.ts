export default defineEventHandler(async () => {
    const strFunctions: Record<string, string> = {};

    for (const [funcName, funcStr] of Object.entries(
        ERUDIT.language.functions,
    )) {
        strFunctions[funcName] = funcStr.toString();
    }

    return strFunctions;
});
