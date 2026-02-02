export type EruditServerConfig = EruditRuntimeConfig & {
  public: EruditPublicRuntimeConfig;
};

export async function setupServerRuntimeConfig() {
  const runtimeConfig = useRuntimeConfig();
  ERUDIT.config = {
    ...runtimeConfig.erudit,
    public: {
      ...runtimeConfig.public.erudit,
    },
  } as EruditServerConfig;
}
