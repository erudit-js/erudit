import {
  type SatoriNode,
  DIM_COLOR,
  truncate,
  ogTitleColor,
  ogRootContainer,
} from '../shared';

export interface IndexOgParams {
  logotypeDataUri?: string;
  siteName?: string;
  short?: string;
  description?: string;
  brandColor: string;
  formatText?: (text: string) => string;
}

export function buildIndexOgTemplate(params: IndexOgParams): SatoriNode {
  const titleColor = ogTitleColor(params.brandColor);
  const fmt = params.formatText ?? ((t: string) => t);

  const children: SatoriNode[] = [];

  // Centered logotype + site name
  const centerColumn: SatoriNode[] = [];

  if (params.logotypeDataUri) {
    centerColumn.push({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 96,
          height: 96,
          borderRadius: '50%',
          backgroundColor: 'white',
          border: '3px solid white',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          overflow: 'hidden',
        },
        children: [
          {
            type: 'img',
            props: {
              src: params.logotypeDataUri,
              width: 80,
              height: 80,
              style: { objectFit: 'contain' as const },
            },
          },
        ],
      },
    });
  }

  if (params.siteName) {
    centerColumn.push({
      type: 'span',
      props: {
        style: {
          fontSize: 56,
          fontWeight: 700,
          color: titleColor,
          textAlign: 'center' as const,
        },
        children: fmt(params.siteName),
      },
    });
  }

  if (params.short) {
    centerColumn.push({
      type: 'span',
      props: {
        style: {
          fontSize: 36,
          fontWeight: 600,
          color: DIM_COLOR,
          lineHeight: 1.3,
          textAlign: 'center' as const,
        },
        children: fmt(params.short),
      },
    });
  }

  children.push({
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingTop: params.description ? 40 : 0,
      },
      children: centerColumn,
    },
  });

  // Bottom description
  if (params.description) {
    const trimmed = truncate(params.description, 200);
    children.push({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          justifyContent: 'center',
          paddingLeft: 80,
          paddingRight: 80,
          paddingBottom: 56,
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                fontSize: 26,
                fontWeight: 400,
                color: DIM_COLOR,
                textAlign: 'center' as const,
                lineHeight: 1.4,
              },
              children: fmt(trimmed),
            },
          },
        ],
      },
    });
  }

  return ogRootContainer(params.brandColor, children);
}
