import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { locator_common_ErrorTrackingService } from "../../locators/locator_error-tracking-service";

export function useClipboard() {
  const isCopyingRef = useRef(false);
  const copy = useCallback(async (text: string) => {
    if (isCopyingRef.current) return;
    isCopyingRef.current = true;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copiado en el portapapeles");
    } catch (error) {
      locator_common_ErrorTrackingService().captureError(error);
      toast.error("Error al copiar en el portapapeles");
    }
    isCopyingRef.current = false;
  }, []);
  return { copyToClipboard: copy };
}
