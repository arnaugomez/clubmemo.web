import { describe, expect, it, vi } from "vitest";
import { waitMilliseconds } from "./promise";

describe("waitMilliseconds", () => {
  it("should call setTimeout with the correct number of milliseconds", async () => {
    const mock = vi.spyOn(global, "setTimeout");
    const ms = 100;
    await waitMilliseconds(ms);
    expect(mock).toHaveBeenCalledWith(expect.anything(), ms);
    mock.mockRestore();
  });

  it("should wait for at least the specified number of milliseconds", async () => {
    const start = performance.now();
    const ms = 80;
    await waitMilliseconds(ms);
    const end = performance.now();
    expect(end - start).toBeGreaterThanOrEqual(ms);
  });
});
