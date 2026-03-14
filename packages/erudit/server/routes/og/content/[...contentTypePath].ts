import { readFileSync, existsSync } from 'node:fs';
import { getIconSvg } from '#layers/erudit/server/erudit/ogImage/icons';
import { renderOgImage } from '#layers/erudit/server/erudit/ogImage/render';
import {
  type ContentOgParams,
  buildContentOgTemplate,
} from '#layers/erudit/server/erudit/ogImage/templates/content';
import { loadLogotypeDataUri } from '#layers/erudit/server/erudit/ogImage/logotype';
import { ogFormatText } from '#layers/erudit/server/erudit/ogImage/formatText';
import {
  checkOgEnabled,
  getOgBrandColor,
  getOgSiteName,
  getOgLearnPhrase,
  getOgLogotypePath,
  sendOgPng,
} from '#layers/erudit/server/erudit/ogImage/shared';
import { parseContentTypePath } from '#layers/erudit/shared/utils/contentTypePath';

export default defineEventHandler(async (event) => {
  checkOgEnabled();

  const rawPath = event.context.params?.contentTypePath;
  if (!rawPath) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing content type path',
    });
  }

  if (!rawPath.endsWith('.png')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'OG image path must end with .png',
    });
  }

  const parsed = parseContentTypePath(rawPath.slice(0, -4));
  const typeOrPart = parsed.type === 'topic' ? parsed.topicPart : parsed.type;
  const contentId = parsed.contentId;

  // Resolve content from nav tree
  const navNode = ERUDIT.contentNav.getNodeOrThrow(contentId);
  const fullId = navNode.fullId;

  // Gather data
  const title = await ERUDIT.repository.content.title(fullId);
  const description = await ERUDIT.repository.content.description(fullId);

  const bookNode = ERUDIT.contentNav.getBookFor(fullId);
  const isBook = navNode.type === 'book';
  const bookTitle = bookNode
    ? await ERUDIT.repository.content.title(bookNode.fullId)
    : undefined;

  const brandColor = getOgBrandColor();
  const siteName = getOgSiteName();

  // Content type icon and label
  const contentIconSvg = getIconSvg(typeOrPart);

  const phrases = ERUDIT.language.phrases;
  const contentLabel =
    typeOrPart === 'book'
      ? phrases.book
      : typeOrPart === 'group'
        ? phrases.group
        : typeOrPart === 'page'
          ? phrases.page
          : typeOrPart === 'article'
            ? phrases.article
            : typeOrPart === 'summary'
              ? phrases.summary
              : typeOrPart === 'practice'
                ? phrases.practice
                : phrases.content;

  // Book icon (for book row above title)
  const bookIconSvg = bookTitle ? getIconSvg('book') : undefined;

  // Decoration image
  let decorationDataUri: string | undefined;
  const decorationPath = await ERUDIT.repository.content.decoration(fullId);
  if (decorationPath) {
    const fullDecorationPath = ERUDIT.paths.project(decorationPath);
    if (existsSync(fullDecorationPath)) {
      const decorationBuffer = readFileSync(fullDecorationPath);
      const ext = decorationPath.split('.').pop()?.toLowerCase();
      const mime =
        ext === 'svg'
          ? 'image/svg+xml'
          : ext === 'png'
            ? 'image/png'
            : ext === 'jpg' || ext === 'jpeg'
              ? 'image/jpeg'
              : ext === 'webp'
                ? 'image/webp'
                : 'image/png';
      decorationDataUri = `data:${mime};base64,${decorationBuffer.toString('base64')}`;
    }
  }

  const logotypeDataUri = await loadLogotypeDataUri(getOgLogotypePath());

  const params: ContentOgParams = {
    title,
    description,
    contentLabel,
    contentIconSvg,
    bookTitle,
    bookIconSvg,
    isBook,
    decorationDataUri,
    logotypeDataUri,
    siteName,
    brandColor,
    formatText: ogFormatText,
    learnButtonText: getOgLearnPhrase(),
  };

  const template = buildContentOgTemplate(params);
  const cacheKey = `content_${typeOrPart}/${fullId}`;
  const png = await renderOgImage(cacheKey, template);

  return sendOgPng(event, png);
});
