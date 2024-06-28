import { cookies } from "next/headers";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CookieServiceNextImpl } from "@/src/common/data/services/cookie-service-next-impl";

vi.mock("next/headers", () => {
  const mockGet = vi.fn();
  const mockSet = vi.fn();
  return {
    cookies: () => ({
      get: mockGet,
      set: mockSet,
    }),
  };
});

describe("CookieServiceNextImpl", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("get method", () => {
    it("returns the cookie value", () => {
      const cookieService = new CookieServiceNextImpl();
      const cookieName = "test-cookie-name";
      const cookieValue = "Test cookie value";
      vi.mocked(cookies().get).mockReturnValue({
        name: cookieName,
        value: cookieValue,
      });

      expect(cookieService.get(cookieName)).toBe(cookieValue);
      expect(cookies().get).toHaveBeenCalledWith(cookieName);
    });

    it("returns undefined when the cookie does not exist", () => {
      const cookieService = new CookieServiceNextImpl();
      const cookieName = "test-cookie-name-2";
      vi.mocked(cookies().get).mockReturnValue(undefined);

      expect(cookieService.get(cookieName)).toBeUndefined();
      expect(cookies().get).toHaveBeenCalledWith(cookieName);
    });
  });

  describe("set method", () => {
    it("should set the cookie with correct attributes", () => {
      const cookieService = new CookieServiceNextImpl();
      const cookieName = "test-cookie-name-3";
      const cookieValue = "Test Cookie Value 3";
      const attributes = { path: "/", maxAge: 3600 };

      cookieService.set({ name: cookieName, value: cookieValue, attributes });

      expect(cookies().set).toHaveBeenCalledWith(
        cookieName,
        cookieValue,
        attributes,
      );
    });
  });
});
