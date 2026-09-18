import * as Layer from "effect/Layer";
import {
  UploadFileUseCase,
  UploadFileUseCaseService,
} from "../domain/use-cases/upload-file-use-case";

export { UploadFileUseCaseService };
export const UploadFileUseCaseLive = Layer.effect(
  UploadFileUseCaseService,
  UploadFileUseCase.make,
);
