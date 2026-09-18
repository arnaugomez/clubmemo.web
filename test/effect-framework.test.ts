// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { ExternalServiceError } from "@/src/common/effect/errors";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";

vi.mock("@/src/common/effect/client-runtime", () => ({
  captureError: vi.fn(),
}));

describe("Next.js control flow across Effect error boundaries", () => {
  it.each([
    "DYNAMIC_SERVER_USAGE",
    "NEXT_REDIRECT;replace;/home;307;",
    "NEXT_HTTP_ERROR_FALLBACK;404",
  ])("does not turn %s into a form error", (digest) => {
    const control = Object.assign(new Error("Framework control flow"), {
      digest,
    });
    const error = new ExternalServiceError({
      operation: "cookies",
      cause: control,
    });
    expect(() => ActionErrorHandler.handle(error)).toThrow(control);
  });
  it("still maps ordinary transport failures to the original form response", () => {
    const result = ActionErrorHandler.handle(
      new ExternalServiceError({
        operation: "database",
        cause: new Error("offline"),
      }),
    );
    expect(result.errors["root.globalError"].message).toBe(
      "Ha ocurrido un error. Inténtalo más tarde.",
    );
  });
});
