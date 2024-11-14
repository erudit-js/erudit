import { ERUDIT_SERVER } from './global';
import { build } from './build/process';
import { close } from './build/close';

export default defineNitroPlugin((_nitro) => {
    ERUDIT_SERVER.BUILD_PROMISE = build();
    _nitro.hooks.hook('request', async () => await ERUDIT_SERVER.BUILD_PROMISE);
    _nitro.hooks.hook('close', close);
});
