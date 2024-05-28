export function getProfilePagePath({
  handle,
  id,
}: {
  handle?: string;
  id: string;
}): string {
  return `/profile/${handle ? handle : `id/${id}`}`;
}
