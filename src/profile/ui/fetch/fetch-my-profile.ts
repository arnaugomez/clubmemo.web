import { cache } from "react";
import { profileLocator } from "../../profile-locator";

export const fetchMyProfile = cache(async () => {
  const useCase = await profileLocator.GetMyProfileUseCase();
  return await useCase.execute();
});
