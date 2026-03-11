import {
  type SatoriNode,
  ARROW_RIGHT_SVG,
  DIM_COLOR,
  svgToDataUri,
  truncate,
  ogTitleColor,
  ogRootContainer,
  ogTopRow,
  ogDescription,
  ogBottomSpacer,
} from '../shared';

export interface ContentOgParams {
  title: string;
  description?: string;
  contentLabel: string;
  contentIconSvg: string;
  bookTitle?: string;
  bookIconSvg?: string;
  isBook: boolean;
  decorationDataUri?: string;
  logotypeDataUri?: string;
  siteName?: string;
  brandColor: string;
  formatText?: (text: string) => string;
  learnButtonText?: string;
}

export function buildContentOgTemplate(params: ContentOgParams): SatoriNode {
  const titleColor = ogTitleColor(params.brandColor);
  const fmt = params.formatText ?? ((t: string) => t);

  const children: SatoriNode[] = [];

  // Top-right: decoration image
  if (params.decorationDataUri) {
    children.push({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          position: 'absolute',
          top: 24,
          right: 32,
        },
        children: [
          {
            type: 'img',
            props: {
              src: params.decorationDataUri,
              width: 180,
              height: 180,
              style: { objectFit: 'contain' as const, opacity: 0.6 },
            },
          },
        ],
      },
    });
  }

  // Top row: site logo + name
  const top = ogTopRow({
    logotypeDataUri: params.logotypeDataUri,
    siteName: params.siteName,
    formatText: params.formatText,
    paddingRight: 240,
  });
  if (top) children.push(top);

  // Center section: content info + title + learn button
  const centerContent: SatoriNode[] = [];

  // Info row: book icon+title / separator / content icon+label
  const infoRow: SatoriNode[] = [];

  if (params.bookTitle && params.bookIconSvg && !params.isBook) {
    const bookTitleTruncated = truncate(params.bookTitle, 40);
    infoRow.push({
      type: 'img',
      props: {
        src: svgToDataUri(params.bookIconSvg, DIM_COLOR),
        width: 26,
        height: 26,
      },
    });
    infoRow.push({
      type: 'span',
      props: {
        style: {
          fontSize: 24,
          color: DIM_COLOR,
          fontWeight: 600,
          maxWidth: 500,
          overflow: 'hidden',
          whiteSpace: 'nowrap' as const,
        },
        children: fmt(bookTitleTruncated),
      },
    });
    infoRow.push({
      type: 'span',
      props: {
        style: {
          fontSize: 24,
          color: DIM_COLOR,
          fontWeight: 400,
          marginLeft: 6,
          marginRight: 6,
        },
        children: '/',
      },
    });
  }

  infoRow.push({
    type: 'img',
    props: {
      src: svgToDataUri(params.contentIconSvg, DIM_COLOR),
      width: 24,
      height: 24,
    },
  });
  infoRow.push({
    type: 'span',
    props: {
      style: {
        fontSize: 24,
        color: DIM_COLOR,
        fontWeight: 600,
      },
      children: fmt(params.contentLabel),
    },
  });

  centerContent.push({
    type: 'div',
    props: {
      style: { display: 'flex', alignItems: 'center', gap: 8 },
      children: infoRow,
    },
  });

  // Content title
  const titleTruncated = truncate(params.title, 80);
  centerContent.push({
    type: 'div',
    props: {
      style: {
        fontSize: 52,
        fontWeight: 700,
        color: titleColor,
        textAlign: 'left' as const,
        lineHeight: 1.25,
        maxHeight: 200,
        overflow: 'hidden',
        wordBreak: 'break-word' as const,
        marginTop: 12,
      },
      children: fmt(titleTruncated),
    },
  });

  // Learn button
  if (params.learnButtonText) {
    centerContent.push({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginTop: 24,
          backgroundColor: params.brandColor,
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
              children: params.learnButtonText,
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
    });
  }

  children.push({
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        flex: 1,
        paddingLeft: 60,
        paddingRight: 240,
      },
      children: centerContent,
    },
  });

  // Bottom: description or spacer
  if (params.description) {
    children.push(
      ogDescription({
        description: params.description,
        formatText: params.formatText,
        paddingRight: 240,
      }),
    );
  } else {
    children.push(ogBottomSpacer());
  }

  return ogRootContainer(params.brandColor, children);
}
