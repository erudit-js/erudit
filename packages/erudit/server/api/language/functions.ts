import { ERUDIT_SERVER } from '@server/global';

export default defineEventHandler(() => {
    const strFunctions: Record<string, string> = {};

    for (const [key, func] of Object.entries(
        ERUDIT_SERVER.LANGUAGE?.functions || {},
    ))
        strFunctions[key] = 'return ' + func.toString();

    return strFunctions;
});
