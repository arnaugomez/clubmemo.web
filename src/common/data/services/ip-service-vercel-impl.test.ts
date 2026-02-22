import { afterEach, describe, expect, it, vi } from "vitest";
import { IpServiceVercelImpl } from "./ip-service-vercel-impl";

const mockGet = vi.fn();

vi.mock("next/headers", () => {
  return {
    headers: vi.fn(async () => ({
      get: mockGet,
    })),
  };
});

describe("IpServiceVercelImpl", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns the first IP from x-forwarded-for, with trimmed spaces", async () => {
    const ipService = new IpServiceVercelImpl();
    mockGet.mockReturnValue(" 192.168.1.1, 192.168.1.2");
    await expect(ipService.getIp()).resolves.toBe("192.168.1.1");
    expect(mockGet).toHaveBeenCalledWith("x-forwarded-for");
  });

  it("returns the IP from x-real-ip (with trimmed spaces) if x-forwarded-for is null", async () => {
    const ipService = new IpServiceVercelImpl();
    mockGet.mockImplementation((header) =>
      header === "x-real-ip" ? "  192.168.1.3     " : null,
    );
    await expect(ipService.getIp()).resolves.toBe("192.168.1.3");
    expect(mockGet).toHaveBeenCalledWith("x-forwarded-for");
    expect(mockGet).toHaveBeenCalledWith("x-real-ip");
  });

  it("returns '0.0.0.0' x-forwarded-for and x-real-ip are both null", async () => {
    const ipService = new IpServiceVercelImpl();
    mockGet.mockReturnValue(null);
    await expect(ipService.getIp()).resolves.toBe("0.0.0.0");
    expect(mockGet).toHaveBeenCalledWith("x-forwarded-for");
    expect(mockGet).toHaveBeenCalledWith("x-real-ip");
  });
});
