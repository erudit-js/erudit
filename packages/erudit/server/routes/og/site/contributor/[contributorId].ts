import { renderOgImage } from '#layers/erudit/server/erudit/ogImage/render';
import {
  type SitePageOgParams,
  buildSitePageOgTemplate,
} from '#layers/erudit/server/erudit/ogImage/templates/sitePage';
import { loadLogotypeDataUri } from '#layers/erudit/server/erudit/ogImage/logotype';
import { getIconSvg } from '#layers/erudit/server/erudit/ogImage/icons';
import { ogFormatText } from '#layers/erudit/server/erudit/ogImage/formatText';
import {
  checkOgEnabled,
  getOgBrandColor,
  getOgSiteName,
  sendOgPng,
} from '#layers/erudit/server/erudit/ogImage/shared';

export default defineEventHandler(async (event) => {
  checkOgEnabled();

  const rawId = event.context.params?.contributorId;
  if (!rawId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing contributor ID',
    });
  }

  // Strip .png suffix if Nitro passes it as part of the param
  const contributorId = rawId.replace(/\.png$/, '');

  const phrases = ERUDIT.language.phrases;

  const contributor = await $fetch<{
    id: string;
    displayName?: string;
    short?: string;
  }>(`/api/contributor/page/${contributorId}`);

  const displayName = contributor.displayName || contributor.id;

  const params: SitePageOgParams = {
    title: displayName,
    description: phrases.contributor_page_description(displayName),
    pageIconSvg: getIconSvg('contributor'),
    logotypeDataUri: await loadLogotypeDataUri(),
    siteName: getOgSiteName(),
    brandColor: getOgBrandColor(),
    formatText: ogFormatText,
    buttonText: phrases.og_open,
  };

  const template = buildSitePageOgTemplate(params);
  const png = await renderOgImage(
    `__site_contributor_${contributorId}`,
    template,
  );

  return sendOgPng(event, png);
});
