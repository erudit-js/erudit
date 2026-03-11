import { renderOgImage } from '#layers/erudit/server/erudit/ogImage/render';
import {
  type IndexOgParams,
  buildIndexOgTemplate,
} from '#layers/erudit/server/erudit/ogImage/templates/index';
import { loadLogotypeDataUri } from '#layers/erudit/server/erudit/ogImage/logotype';
import { ogFormatText } from '#layers/erudit/server/erudit/ogImage/formatText';
import {
  checkOgEnabled,
  getOgBrandColor,
  getOgSiteName,
  sendOgPng,
} from '#layers/erudit/server/erudit/ogImage/shared';

export default defineEventHandler(async (event) => {
  checkOgEnabled();

  const brandColor = getOgBrandColor();
  const siteName = getOgSiteName();
  const logotypeDataUri = await loadLogotypeDataUri();

  const siteShort = ERUDIT.config.public.asideMajor?.siteInfo?.short;

  let description: string | undefined;
  try {
    const indexPage = await $fetch<{
      description?: string;
      seo?: { description?: string };
    }>('/api/indexPage');
    description = indexPage?.seo?.description || indexPage?.description;
  } catch {
    // Ignore
  }

  const params: IndexOgParams = {
    logotypeDataUri,
    siteName,
    short: siteShort || undefined,
    description,
    brandColor,
    formatText: ogFormatText,
  };

  const template = buildIndexOgTemplate(params);
  const png = await renderOgImage('__index', template);

  return sendOgPng(event, png);
});
