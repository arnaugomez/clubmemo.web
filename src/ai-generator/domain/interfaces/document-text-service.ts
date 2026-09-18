import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import type { ExternalServiceError } from "@/src/common/effect/errors";

/** Extracts source text while owning the lifetime of PDF workers. */
export class DocumentTextService extends Context.Service<
  DocumentTextService,
  {
    readonly read: (file: File) => Effect.Effect<string, ExternalServiceError>;
  }
>()("clubmemo/DocumentTextService") {}
