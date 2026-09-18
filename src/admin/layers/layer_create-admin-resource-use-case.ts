import * as Layer from "effect/Layer";
import {
  CreateAdminResourceUseCase,
  CreateAdminResourceUseCaseService,
} from "../domain/use-cases/create-admin-resource-use-case";

export { CreateAdminResourceUseCaseService };
export const CreateAdminResourceUseCaseLive = Layer.effect(
  CreateAdminResourceUseCaseService,
  CreateAdminResourceUseCase.make,
);
