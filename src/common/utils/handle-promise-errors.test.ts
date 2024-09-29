import { describe, expect, it, vi } from "vitest";
import { handlePromiseError } from "./handle-promise-error";

const captureError = vi.fn();
vi.mock("../locators/locator_error-tracking-service.ts", () => ({
  locator_common_ErrorTrackingService: () => ({
    captureError,
  }),
}));

describe("handlePromiseError", () => {
  it("returns the resolved value of the promise", async () => {
    const mockValue = "test1";
    const promise = Promise.resolve(mockValue);
    const result = await handlePromiseError(promise);
    expect(result).toBe(mockValue);
    expect(captureError).not.toHaveBeenCalled();
    captureError.mockClear();
  });

  it("returns undefined when the promise rejects with an error and captures the error with the ErrorTrackingService", async () => {
    const mockError = new Error("Test Error");
    const promise = Promise.reject(mockError);
    const result = await handlePromiseError(promise);
    expect(result).toBeUndefined();
    expect(captureError).toHaveBeenCalled();
    captureError.mockClear();
  });
});
