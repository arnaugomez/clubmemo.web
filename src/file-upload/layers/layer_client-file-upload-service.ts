import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { ClientFileUploadServiceS3Impl } from "../data/services/client-file-upload-service-s3-impl";
import { ClientFileUploadService } from "../domain/interfaces/client-file-upload-service";

export { ClientFileUploadService };
export const ClientFileUploadServiceLive = Layer.effect(
  ClientFileUploadService,
  Effect.sync(() => {
    return new ClientFileUploadServiceS3Impl();
  }),
);
