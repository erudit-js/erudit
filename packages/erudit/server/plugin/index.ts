import { ERUDIT_SERVER } from '@server/global';
import { build } from '@server/build/process';
import { close } from '@server/build/close';

export default defineNitroPlugin((_nitro) => {
    build();
    _nitro.hooks.hook('request', async () => await ERUDIT_SERVER.BUILD_PROMISE);
    _nitro.hooks.hook('close', close);
});
