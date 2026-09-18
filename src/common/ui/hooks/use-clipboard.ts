import * as Effect from "effect/Effect";
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { captureError, runClient } from "@/src/common/effect/client-runtime";
import { ExternalServiceError } from "@/src/common/effect/errors";

export function useClipboard() {
  const isCopyingRef = useRef(false);
  const copy = useCallback(async (text: string) => {
    if (isCopyingRef.current) return;
    isCopyingRef.current = true;
    await runClient(
      Effect.tryPromise({
        try: () => navigator.clipboard.writeText(text),
        catch: (cause) =>
          new ExternalServiceError({ operation: "clipboard.writeText", cause }),
      }).pipe(
        Effect.match({
          onSuccess: () => {
            toast.success("Copiado en el portapapeles");
          },
          onFailure: (error) => {
            captureError(error);
            toast.error("Error al copiar en el portapapeles");
          },
        }),
        Effect.ensuring(
          Effect.sync(() => {
            isCopyingRef.current = false;
          }),
        ),
      ),
    );
  }, []);
  return { copyToClipboard: copy };
}
