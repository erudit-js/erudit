export const contentProseTypes = [
  'page',
  'article',
  'summary',
  'practice',
] as const;

export type ContentProseType = (typeof contentProseTypes)[number];

export function isContentProseType(value: unknown): value is ContentProseType {
  return (
    typeof value === 'string' &&
    contentProseTypes.includes(value as ContentProseType)
  );
}
