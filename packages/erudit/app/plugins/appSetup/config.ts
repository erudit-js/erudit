export type EruditAppConfig = EruditRuntimeConfig;

export async function setupAppRuntimeConfig() {
  const runtimeConfig = useRuntimeConfig();
  ERUDIT.config = runtimeConfig.public.erudit as any;
  ERUDIT.mode = runtimeConfig.public.eruditMode as any;
}
