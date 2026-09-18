import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { EnvService } from "@/src/common/layers/layer_env-service";
import { FileUploadServiceS3Impl } from "../data/services/file-upload-service-s3-impl";
import { FileUploadService } from "../domain/interfaces/file-upload-service";

export { FileUploadService };
export const FileUploadServiceLive = Layer.effect(
  FileUploadService,
  Effect.gen(function* () {
    const env = yield* EnvService;
    return yield* Effect.acquireRelease(
      Effect.sync(() => new FileUploadServiceS3Impl(env)),
      (client) => Effect.sync(() => client.close()),
    );
  }),
);
