export function getSponsorAvatarUrl(
  sponsorId: string,
  avatarExtension: string | undefined,
): string | undefined {
  if (!avatarExtension) {
    return undefined;
  }

  return '/file/sponsors/' + sponsorId + '/avatar.' + avatarExtension;
}
