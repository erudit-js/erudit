import type { Nuxt } from '@nuxt/schema';
import { sn } from 'unslash';

import {
  PUBLIC_ERUDIT_BASE_URL,
  PUBLIC_PROJECT_BASE_URL,
} from '../globals/public';
import { ERUDIT_PATH, PROJECT_PATH } from '../env';

export async function setupEruditPublicAssets(nuxt: Nuxt) {
  const nitro = nuxt.options.nitro;
  const nitroPublicAssets = (nitro.publicAssets ||= []);
  const nitroModules = (nitro.modules ||= []);

  // Clear default Nuxt/Nitro public assets
  nitroModules.push((nitro) => {
    nitro.options.publicAssets = nitro.options.publicAssets?.filter((item) => {
      const wantsToCopyToRoot = item.baseURL === '/';
      const fromEruditPublic = item.dir === sn(ERUDIT_PATH, 'public');
      const fromProjectPublic = item.dir === sn(PROJECT_PATH, 'public');

      if (wantsToCopyToRoot && (fromEruditPublic || fromProjectPublic)) {
        return false;
      }

      return true;
    });
  });

  // Adding Erudit package and project public assets
  nitroPublicAssets.push(
    {
      baseURL: PUBLIC_ERUDIT_BASE_URL,
      dir: sn(ERUDIT_PATH, 'public'),
      maxAge: 60 * 60 * 24 * 365,
    },
    {
      baseURL: PUBLIC_PROJECT_BASE_URL,
      dir: sn(PROJECT_PATH, 'public'),
      maxAge: 60 * 60 * 24 * 365,
    },
  );
}
