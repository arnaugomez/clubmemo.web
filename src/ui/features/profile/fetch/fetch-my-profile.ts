import { cache } from "react";

import { ProfileModel } from "@/src/core/profile/domain/models/profile-model";
import { locator } from "../../../../core/app/locator";
import { fetchSession } from "../../auth/fetch/fetch-session";

export const fetchMyProfile = cache(async (): Promise<ProfileModel | null> => {
  const { user } = await fetchSession();
  if (!user) return null;
  const ProfilesRepository = await locator.ProfilesRepository();
  return await ProfilesRepository.getByUserId(user.id);
});
