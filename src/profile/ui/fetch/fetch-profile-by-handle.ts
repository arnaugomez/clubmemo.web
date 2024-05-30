import { locator } from "@/src/common/di/locator";
import { cache } from "react";

export const fetchProfileByHandle = cache(async (handle: string) => {
  const profilesRepository = await locator.ProfilesRepository();
  return profilesRepository.getByHandle(handle);
});
