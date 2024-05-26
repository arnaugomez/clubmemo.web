import type { ProfileModel } from "../../domain/models/profile-model";

export function getProfilePagePath(profile: ProfileModel): string {
  return `/profile/${profile.handle ? profile.handle : `id/${profile.id}`}`;
}
