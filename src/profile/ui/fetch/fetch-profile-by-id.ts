import { locator } from "@/src/common/di/locator";
import { cache } from "react";

export const fetchProfileById = cache(async (id: string) => {
  const profilesRepository = await locator.ProfilesRepository();
  return profilesRepository.get(id);
});
