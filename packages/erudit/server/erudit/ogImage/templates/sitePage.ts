import {
  type SatoriNode,
  DIM_COLOR,
  svgToDataUri,
  truncate,
  ogTitleColor,
  ogRootContainer,
  ogTopRow,
  ogDescription,
  ogBottomSpacer,
  ogActionButton,
} from '../shared';

export interface SitePageOgParams {
  title: string;
  description?: string;
  pageIconSvg: string;
  logotypeDataUri?: string;
  siteName?: string;
  brandColor: string;
  formatText?: (text: string) => string;
  learnButtonText?: string;
}

export function buildSitePageOgTemplate(params: SitePageOgParams): SatoriNode {
  const titleColor = ogTitleColor(params.brandColor);
  const fmt = params.formatText ?? ((t: string) => t);

  const children: SatoriNode[] = [];

  // Top row: site logo + name
  const top = ogTopRow({
    logotypeDataUri: params.logotypeDataUri,
    siteName: params.siteName,
    formatText: params.formatText,
  });
  if (top) children.push(top);

  // Center: icon + title inline
  const titleTruncated = truncate(params.title, 60);
  children.push({
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        flex: 1,
        paddingLeft: 60,
        paddingRight: 60,
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            },
            children: [
              {
                type: 'img',
                props: {
                  src: svgToDataUri(params.pageIconSvg, DIM_COLOR),
                  width: 44,
                  height: 44,
                },
              },
              {
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
                  },
                  children: fmt(titleTruncated),
                },
              },
            ],
          },
        },
        // Action button
        ...(params.learnButtonText
          ? [ogActionButton(params.brandColor, params.learnButtonText)]
          : []),
      ],
    },
  });

  // Bottom: description or spacer
  if (params.description) {
    children.push(
      ogDescription({
        description: params.description,
        formatText: params.formatText,
      }),
    );
  } else {
    children.push(ogBottomSpacer());
  }

  return ogRootContainer(params.brandColor, children);
}
