import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { ExternalServiceError } from "@/src/common/effect/errors";
import { DocumentTextService } from "../../domain/interfaces/document-text-service";

type PdfDocument = {
  numPages: number;
  getPage(page: number): Promise<{
    getTextContent(): Promise<{ items: ReadonlyArray<{ str?: string }> }>;
  }>;
};
type PdfLibrary = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument(data: Uint8Array): {
    promise: Promise<PdfDocument>;
    destroy(): Promise<void>;
  };
};

const failure = (cause: unknown) =>
  new ExternalServiceError({ operation: "DocumentTextService.read", cause });

export const DocumentTextServiceBrowser = Layer.succeed(DocumentTextService, {
  read: Effect.fn("DocumentTextService.read")(function* (file: File) {
    if (file.type !== "application/pdf") {
      return yield* Effect.tryPromise({
        try: () => file.text(),
        catch: failure,
      });
    }
    const data = yield* Effect.tryPromise({
      try: () => file.arrayBuffer(),
      catch: failure,
    });
    return yield* Effect.scoped(
      Effect.gen(function* () {
        const task = yield* Effect.acquireRelease(
          Effect.try({
            try: () => {
              const library = (window as unknown as { pdfjsLib: PdfLibrary })
                .pdfjsLib;
              library.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.mjs";
              return library.getDocument(new Uint8Array(data));
            },
            catch: failure,
          }),
          (task) => Effect.promise(() => task.destroy()),
        );
        const document = yield* Effect.tryPromise({
          try: () => task.promise,
          catch: failure,
        });
        const pages = yield* Effect.forEach(
          Array.from({ length: document.numPages }, (_, index) => index + 1),
          Effect.fn(function* (pageNumber) {
            const page = yield* Effect.tryPromise({
              try: () => document.getPage(pageNumber),
              catch: failure,
            });
            const content = yield* Effect.tryPromise({
              try: () => page.getTextContent(),
              catch: failure,
            });
            return content.items.map((item) => item.str ?? "").join(" ");
          }),
          { concurrency: "unbounded" },
        );
        return pages.join("\n");
      }),
    );
  }),
});
