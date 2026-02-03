import { brandLogotype } from '@erudit-js/core/brand';

export async function setupHtmlBranding() {
  const brandingComment = document.createComment(`\n${brandLogotype}\n`);
  document.insertBefore(brandingComment, document.firstChild);
}
