export function getContributorAvatarUrl(
  contributorId: string,
  avatarExtension: string | undefined,
): string | undefined {
  if (!avatarExtension) {
    return undefined;
  }

  return '/file/contributors/' + contributorId + '/avatar.' + avatarExtension;
}
