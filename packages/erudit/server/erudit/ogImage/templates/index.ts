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
  const centerRow: SatoriNode[] = [];

  if (params.logotypeDataUri) {
    centerRow.push({
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

  if (params.siteName || params.short) {
    const textColumn: SatoriNode[] = [];

    if (params.siteName) {
      textColumn.push({
        type: 'span',
        props: {
          style: {
            fontSize: 56,
            fontWeight: 700,
            color: titleColor,
          },
          children: fmt(params.siteName),
        },
      });
    }

    if (params.short) {
      textColumn.push({
        type: 'span',
        props: {
          style: {
            fontSize: 28,
            fontWeight: 600,
            color: DIM_COLOR,
            lineHeight: 1.3,
          },
          children: fmt(params.short),
        },
      });
    }

    centerRow.push({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column' as const,
          gap: 2,
        },
        children: textColumn,
      },
    });
  }

  children.push({
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        paddingTop: params.description ? 40 : 0,
      },
      children: centerRow,
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
