import { readFileSync } from 'node:fs';
import { ICONS } from '../../../shared/utils/icons';

const ICON_MAP: Record<string, string> = {
  ...ICONS,
  contributors: 'users',
  contributor: 'user',
  sponsors: 'diamond',
};

const iconCache = new Map<string, string>();

export function getIconSvg(contentType: string): string {
  const cached = iconCache.get(contentType);
  if (cached) return cached;

  const iconName = ICON_MAP[contentType] || 'lines';
  const iconPath = ERUDIT.paths.erudit('app/assets/icons', iconName + '.svg');
  const svg = readFileSync(iconPath, 'utf-8');
  iconCache.set(contentType, svg);
  return svg;
}
