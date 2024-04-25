import { cache } from "react";

import { ProfileModel } from "@/src/profile/domain/models/profile-model";
import { fetchSession } from "../../../auth/ui/fetch/fetch-session";
import { locator } from "../../../common/locator";

export const fetchMyProfile = cache(async (): Promise<ProfileModel | null> => {
  const { user } = await fetchSession();
  if (!user) return null;
  const ProfilesRepository = await locator.ProfilesRepository();
  return await ProfilesRepository.getByUserId(user.id);
});
