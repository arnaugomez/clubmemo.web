import * as Effect from "effect/Effect";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CookieServiceNextImpl } from "@/src/common/data/services/cookie-service-next-impl";

const mockGet = vi.fn();
const mockSet = vi.fn();

vi.mock("next/headers", () => {
  return {
    cookies: vi.fn(async () => ({
      get: mockGet,
      set: mockSet,
    })),
  };
});

describe("CookieServiceNextImpl", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("get method", () => {
    it("returns the cookie value", async () => {
      const cookieService = new CookieServiceNextImpl();
      const cookieName = "test-cookie-name";
      const cookieValue = "Test cookie value";
      mockGet.mockReturnValue({
        name: cookieName,
        value: cookieValue,
      });

      await expect(
        Effect.runPromise(cookieService.get(cookieName)),
      ).resolves.toBe(cookieValue);
      expect(mockGet).toHaveBeenCalledWith(cookieName);
    });

    it("returns undefined when the cookie does not exist", async () => {
      const cookieService = new CookieServiceNextImpl();
      const cookieName = "test-cookie-name-2";
      mockGet.mockReturnValue(undefined);

      await expect(
        Effect.runPromise(cookieService.get(cookieName)),
      ).resolves.toBeUndefined();
      expect(mockGet).toHaveBeenCalledWith(cookieName);
    });
  });

  describe("set method", () => {
    it("should set the cookie with correct attributes", async () => {
      const cookieService = new CookieServiceNextImpl();
      const cookieName = "test-cookie-name-3";
      const cookieValue = "Test Cookie Value 3";
      const attributes = { path: "/", maxAge: 3600 };

      await Effect.runPromise(
        cookieService.set({
          name: cookieName,
          value: cookieValue,
          attributes,
        }),
      );

      expect(mockSet).toHaveBeenCalledWith(cookieName, cookieValue, attributes);
    });
  });
});
