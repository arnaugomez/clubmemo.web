import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { headers } from "next/headers";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IpServiceVercelImpl } from "./ip-service-vercel-impl";

vi.mock("next/headers", () => {
  const mockGet = vi.fn();
  return {
    headers() {
      return {
        get: mockGet,
      };
    },
  };
});

describe("IpServiceVercelImpl", () => {
  let mockHeaders: ReadonlyHeaders;

  beforeEach(() => {
    mockHeaders = headers();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns the first IP from x-forwarded-for, with trimmed spaces", async () => {
    const ipService = new IpServiceVercelImpl();
    vi.mocked(mockHeaders.get).mockReturnValue(" 192.168.1.1, 192.168.1.2");
    await expect(ipService.getIp()).resolves.toBe("192.168.1.1");
    expect(mockHeaders.get).toHaveBeenCalledWith("x-forwarded-for");
  });

  it("returns the IP from x-real-ip (with trimmed spaces) if x-forwarded-for is null", async () => {
    const ipService = new IpServiceVercelImpl();
    vi.mocked(mockHeaders.get).mockImplementation((header) =>
      header === "x-real-ip" ? "  192.168.1.3     " : null,
    );
    await expect(ipService.getIp()).resolves.toBe("192.168.1.3");
    expect(mockHeaders.get).toHaveBeenCalledWith("x-forwarded-for");
    expect(mockHeaders.get).toHaveBeenCalledWith("x-real-ip");
  });

  it("returns '0.0.0.0' x-forwarded-for and x-real-ip are both null", async () => {
    const ipService = new IpServiceVercelImpl();
    vi.mocked(mockHeaders.get).mockReturnValue(null);
    await expect(ipService.getIp()).resolves.toBe("0.0.0.0");
    expect(mockHeaders.get).toHaveBeenCalledWith("x-forwarded-for");
    expect(mockHeaders.get).toHaveBeenCalledWith("x-real-ip");
  });
});
