import * as Layer from "effect/Layer";
import {
  GetNotesUseCase,
  GetNotesUseCaseService,
} from "../domain/use-cases/get-notes-use-case";

export { GetNotesUseCaseService };
export const GetNotesUseCaseLive = Layer.effect(
  GetNotesUseCaseService,
  GetNotesUseCase.make,
);
