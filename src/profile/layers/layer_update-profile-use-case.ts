import * as Layer from "effect/Layer";
import {
  UpdateProfileUseCase,
  UpdateProfileUseCaseService,
} from "../domain/use-cases/update-profile-use-case";

export { UpdateProfileUseCaseService };
export const UpdateProfileUseCaseLive = Layer.effect(
  UpdateProfileUseCaseService,
  UpdateProfileUseCase.make,
);
