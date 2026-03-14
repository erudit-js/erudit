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
  getOgOpenPhrase,
  getOgLogotypePath,
  sendOgPng,
} from '#layers/erudit/server/erudit/ogImage/shared';

export default defineEventHandler(async (event) => {
  checkOgEnabled();

  const phrases = ERUDIT.language.phrases;

  const params: SitePageOgParams = {
    title: phrases.contributors,
    description: phrases.contributors_description,
    pageIconSvg: getIconSvg('contributors'),
    logotypeDataUri: await loadLogotypeDataUri(getOgLogotypePath()),
    siteName: getOgSiteName(),
    brandColor: getOgBrandColor(),
    formatText: ogFormatText,
    learnButtonText: getOgOpenPhrase(),
  };

  const template = buildSitePageOgTemplate(params);
  const png = await renderOgImage('__site_contributors', template);

  return sendOgPng(event, png);
});
