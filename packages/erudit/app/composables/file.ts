export function fileUrl(path: string) {
  const withBaseUrl = useBaseUrl();
  return withBaseUrl('/file/' + path);
}
