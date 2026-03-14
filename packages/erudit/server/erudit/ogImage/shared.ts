export type SatoriNode =
  | string
  | number
  | {
      type: string;
      props: {
        style?: Record<string, unknown>;
        children?: SatoriNode | SatoriNode[];
        [key: string]: unknown;
      };
    };

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
export const DIM_COLOR = '#555555';

export function svgToDataUri(svg: string, fill?: string): string {
  let processed = svg;
  if (fill) {
    processed = processed.replace(/<path /g, `<path fill="${fill}" `);
  }
  return 'data:image/svg+xml,' + encodeURIComponent(processed);
}

function mixColors(hex1: string, hex2: string, ratio: number): string {
  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);
  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);
  const r = Math.round(r1 * ratio + r2 * (1 - ratio));
  const g = Math.round(g1 * ratio + g2 * (1 - ratio));
  const b = Math.round(b1 * ratio + b2 * (1 - ratio));
  return `rgb(${r}, ${g}, ${b})`;
}

function mixWithWhite(hex: string, ratio: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mr = Math.round(r + (255 - r) * (1 - ratio));
  const mg = Math.round(g + (255 - g) * (1 - ratio));
  const mb = Math.round(b + (255 - b) * (1 - ratio));
  return `rgb(${mr}, ${mg}, ${mb})`;
}

export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1).trimEnd() + '\u2026';
}

export function ogBrandGradient(brandColor: string): string {
  const brandMixed = mixWithWhite(brandColor, 0.5);
  return `linear-gradient(to bottom right, ${brandMixed}, #ffffff)`;
}

export function ogTitleColor(brandColor: string): string {
  return mixColors(brandColor, '#1a1a1a', 0.6);
}

export function ogRootContainer(
  brandColor: string,
  children: SatoriNode[],
): SatoriNode {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column' as const,
        width: OG_WIDTH,
        height: OG_HEIGHT,
        background: ogBrandGradient(brandColor),
        fontFamily: 'Noto Sans',
        position: 'relative' as const,
      },
      children,
    },
  };
}

export function ogTopRow(params: {
  logotypeDataUri?: string;
  siteName?: string;
  formatText?: (text: string) => string;
  paddingRight?: number;
}): SatoriNode | undefined {
  const fmt = params.formatText ?? ((t: string) => t);
  const items: SatoriNode[] = [];

  if (params.logotypeDataUri) {
    items.push({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: 'white',
          border: '2px solid white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        },
        children: [
          {
            type: 'img',
            props: {
              src: params.logotypeDataUri,
              width: 54,
              height: 54,
              style: { objectFit: 'contain' as const },
            },
          },
        ],
      },
    });
  }

  if (params.siteName) {
    items.push({
      type: 'span',
      props: {
        style: {
          fontSize: 36,
          color: DIM_COLOR,
          fontWeight: 600,
        },
        children: fmt(params.siteName),
      },
    });
  }

  if (items.length === 0) return undefined;

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        paddingLeft: 56,
        paddingRight: params.paddingRight ?? 60,
        paddingTop: 48,
      },
      children: items,
    },
  };
}

export function ogDescription(params: {
  description: string;
  formatText?: (text: string) => string;
  maxLen?: number;
  paddingRight?: number;
}): SatoriNode {
  const fmt = params.formatText ?? ((t: string) => t);
  const trimmed = truncate(params.description, params.maxLen ?? 360);

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        paddingLeft: 60,
        paddingRight: params.paddingRight ?? 60,
        paddingBottom: 48,
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              fontSize: 24,
              fontWeight: 400,
              color: DIM_COLOR,
              textAlign: 'left' as const,
              lineHeight: 1.4,
              wordBreak: 'break-word' as const,
            },
            children: fmt(trimmed),
          },
        },
      ],
    },
  };
}

const ARROW_RIGHT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;

export function ogActionButton(brandColor: string, text: string): SatoriNode {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginTop: 24,
        backgroundColor: brandColor,
        borderRadius: 32,
        paddingLeft: 32,
        paddingRight: 26,
        paddingTop: 14,
        paddingBottom: 14,
        boxShadow: `0 6px 20px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.1)`,
        alignSelf: 'flex-start' as const,
        border: '3px solid rgba(255,255,255,0.4)',
      },
      children: [
        {
          type: 'span',
          props: {
            style: {
              fontSize: 24,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: 0.5,
            },
            children: text,
          },
        },
        {
          type: 'img',
          props: {
            src: 'data:image/svg+xml,' + encodeURIComponent(ARROW_RIGHT_SVG),
            width: 22,
            height: 22,
          },
        },
      ],
    },
  };
}

export function ogBottomSpacer(): SatoriNode {
  return {
    type: 'div',
    props: {
      style: { display: 'flex', paddingTop: 80 },
      children: [],
    },
  };
}

export function sendOgPng(event: Parameters<typeof setHeader>[0], png: Buffer) {
  setHeader(event, 'Content-Type', 'image/png');
  setHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=86400');
  return png;
}

function getOgImageConfig() {
  return ERUDIT.config.public.seo?.ogImage;
}

export function checkOgEnabled() {
  const ogImageConfig = getOgImageConfig();
  if (ogImageConfig?.type !== 'auto') {
    throw createError({
      statusCode: 404,
      statusMessage: 'OG image generation is disabled',
    });
  }
}

export function getOgBrandColor(): string {
  const ogImageConfig = getOgImageConfig();
  if (ogImageConfig?.type === 'auto') {
    return ogImageConfig.siteColor;
  }
  return '#4aa44c';
}

export function getOgSiteName(): string | undefined {
  const ogImageConfig = getOgImageConfig();
  if (ogImageConfig?.type === 'auto') {
    return ogImageConfig.siteName;
  }
  return undefined;
}

export function getOgSiteShort(): string | undefined {
  const ogImageConfig = getOgImageConfig();
  if (ogImageConfig?.type === 'auto') {
    return ogImageConfig.siteShort;
  }
  return undefined;
}

export function getOgLearnPhrase(): string {
  const ogImageConfig = getOgImageConfig();
  if (ogImageConfig?.type === 'auto') {
    return typeof ogImageConfig.phrases === 'string'
      ? ogImageConfig.phrases
      : ogImageConfig.phrases.learn;
  }
  return 'Learn';
}

export function getOgOpenPhrase(): string {
  const ogImageConfig = getOgImageConfig();
  if (ogImageConfig?.type === 'auto') {
    return typeof ogImageConfig.phrases === 'string'
      ? ogImageConfig.phrases
      : ogImageConfig.phrases.open;
  }
  return 'Open';
}

export function getOgLogotypePath(): string | undefined {
  const ogImageConfig = getOgImageConfig();
  if (ogImageConfig?.type === 'auto') {
    return ogImageConfig.logotype;
  }
  return undefined;
}
