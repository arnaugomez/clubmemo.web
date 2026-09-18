import * as Effect from "effect/Effect";
import * as Result from "effect/Result";
import { runServer } from "@/src/common/effect/server-runtime";
import { ApiErrorHandler } from "@/src/common/ui/api/api-error-handler";
import { FileUploadsRepository } from "@/src/file-upload/layers/layer_file-uploads-repository";

/**
 * Deletes all the files from the external storage service that are no longer in
 * use. It is expected to be called frequently by a cron job process.
 */
export async function GET() {
  return runServer(
    Effect.gen(function* () {
      {
        const outcome = yield* Effect.result(
          Effect.gen(function* () {
            const repository = yield* FileUploadsRepository;
            yield* repository.deleteOutdated();
            return new Response("Cron job successful");
          }),
        );
        if (Result.isFailure(outcome)) {
          const e = outcome.failure;
          return ApiErrorHandler.handle(e);
        } else {
          return outcome.success;
        }
      }
    }),
  );
}
