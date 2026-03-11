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

export interface SitePageOgParams {
  title: string;
  description?: string;
  pageIconSvg: string;
  logotypeDataUri?: string;
  siteName?: string;
  brandColor: string;
  formatText?: (text: string) => string;
  buttonText?: string;
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
        ...(params.buttonText
          ? [
              {
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
                        children: params.buttonText,
                      },
                    },
                    {
                      type: 'img',
                      props: {
                        src:
                          'data:image/svg+xml,' +
                          encodeURIComponent(ARROW_RIGHT_SVG),
                        width: 22,
                        height: 22,
                      },
                    },
                  ],
                },
              },
            ]
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
