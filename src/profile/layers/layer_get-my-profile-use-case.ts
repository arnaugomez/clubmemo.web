import * as Layer from "effect/Layer";
import {
  GetMyProfileUseCase,
  GetMyProfileUseCaseService,
} from "../domain/use-cases/get-my-profile-use-case";

export { GetMyProfileUseCaseService };
export const GetMyProfileUseCaseLive = Layer.effect(
  GetMyProfileUseCaseService,
  GetMyProfileUseCase.make,
);
