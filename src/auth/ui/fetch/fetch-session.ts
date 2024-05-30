import { cache } from "react";
import { authLocator } from "../../auth-locator";

export const fetchSession = cache(async () => {
  const useCase = authLocator.GetSessionUseCase();
  return await useCase.execute();
});
