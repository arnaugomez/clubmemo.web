import * as Layer from "effect/Layer";
import {
  DeleteUserUseCase,
  DeleteUserUseCaseService,
} from "../domain/use-cases/delete-user-use-case";

export { DeleteUserUseCaseService };
export const DeleteUserUseCaseLive = Layer.effect(
  DeleteUserUseCaseService,
  DeleteUserUseCase.make,
);
