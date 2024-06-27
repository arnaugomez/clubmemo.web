import { vi } from "vitest";

export const mockConsoleError = () =>
  vi.spyOn(console, "error").mockImplementation(() => undefined);
