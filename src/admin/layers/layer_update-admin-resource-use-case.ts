import * as Layer from "effect/Layer";
import {
  UpdateAdminResourceUseCase,
  UpdateAdminResourceUseCaseService,
} from "../domain/use-cases/update-admin-resource-use-case";

export { UpdateAdminResourceUseCaseService };
export const UpdateAdminResourceUseCaseLive = Layer.effect(
  UpdateAdminResourceUseCaseService,
  UpdateAdminResourceUseCase.make,
);
