import * as Cause from "effect/Cause";
import * as Effect from "effect/Effect";
import * as Exit from "effect/Exit";
import * as Layer from "effect/Layer";
import * as ManagedRuntime from "effect/ManagedRuntime";
import { DocumentTextServiceBrowser } from "@/src/ai-generator/data/services/document-text-service-browser";
import { ClientFileUploadServiceLive } from "@/src/file-upload/layers/layer_client-file-upload-service";
import {
  ErrorTrackingService,
  ErrorTrackingServiceLive,
} from "../layers/layer_error-tracking-service";

const ClientLive = Layer.mergeAll(
  ErrorTrackingServiceLive,
  ClientFileUploadServiceLive,
  DocumentTextServiceBrowser,
);
const runtime = ManagedRuntime.make(ClientLive);

export async function runClient<A, E>(
  program: Effect.Effect<A, E, Layer.Success<typeof ClientLive>>,
  signal?: AbortSignal,
): Promise<A> {
  const exit = await runtime.runPromiseExit(program, { signal });
  if (Exit.isSuccess(exit)) return exit.value;
  throw Cause.squash(exit.cause);
}

/** Framework error callbacks are synchronous; reporting itself is an Effect. */
export function captureError(error: unknown): void {
  runtime.runFork(
    Effect.gen(function* () {
      const tracking = yield* ErrorTrackingService;
      yield* tracking.captureError(error);
    }),
  );
}
