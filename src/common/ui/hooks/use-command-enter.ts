import { useEffect, useRef } from "react";

export function useCommandEnter(fn: () => Promise<void>) {
  const isSubmitting = useRef(false);
  useEffect(() => {
    async function eventListener(e: KeyboardEvent) {
      if (
        !isSubmitting.current &&
        e.key === "Enter" &&
        (e.ctrlKey || e.metaKey)
      ) {
        isSubmitting.current = true;
        await fn();
        isSubmitting.current = false;
      }
    }
    document.addEventListener("keydown", eventListener);
    return () => document.removeEventListener("keydown", eventListener);
  }, [fn]);
}
