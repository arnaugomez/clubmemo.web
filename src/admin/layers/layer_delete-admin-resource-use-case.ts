import * as Layer from "effect/Layer";
import {
  DeleteAdminResourceUseCase,
  DeleteAdminResourceUseCaseService,
} from "../domain/use-cases/delete-admin-resource-use-case";

export { DeleteAdminResourceUseCaseService };
export const DeleteAdminResourceUseCaseLive = Layer.effect(
  DeleteAdminResourceUseCaseService,
  DeleteAdminResourceUseCase.make,
);
