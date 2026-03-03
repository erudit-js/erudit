/**
 * Converts a name string into a valid JavaScript identifier segment.
 * Replaces non-alphanumeric/underscore/$ characters with `_`.
 * Prefixes with `_` if the result starts with a digit.
 * Returns `_` if the result is empty.
 */
export function toJsSlug(name: string): string {
  let slug = name.replace(/[^a-zA-Z0-9_$]/g, '_');

  if (/^[0-9]/.test(slug)) {
    slug = '_' + slug;
  }

  if (!slug) {
    slug = '_';
  }

  return slug;
}
