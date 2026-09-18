import * as Layer from "effect/Layer";
import {
  GetAdminResourcesUseCase,
  GetAdminResourcesUseCaseService,
} from "../domain/use-cases/get-admin-resources-use-case";

export { GetAdminResourcesUseCaseService };
export const GetAdminResourcesUseCaseLive = Layer.effect(
  GetAdminResourcesUseCaseService,
  GetAdminResourcesUseCase.make,
);
