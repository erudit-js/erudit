export const contentTypes = ['book', 'group', 'page', 'topic'] as const;

export type ContentType = (typeof contentTypes)[number];

export function isContentType(value: unknown): value is ContentType {
  return contentTypes.includes(value as ContentType);
}
