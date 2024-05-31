import { headers } from "next/headers";
import type { IpService } from "../../domain/interfaces/ip-service";

/**
 * Implementation of `IpService` that uses the Next.js `headers` function to
 * extract the IP address from the `x-forwarded-for` or `x-real-ip` headers. It
 * does work in the Vercel deployment environment but might not work in other
 * situations
 */
export class IpServiceVercelImpl implements IpService {
  async getIp(): Promise<string> {
    const forwardedFor = headers().get("x-forwarded-for");

    if (forwardedFor) {
      return forwardedFor.split(",")[0].trim();
    }
    const realIp = headers().get("x-real-ip");

    if (realIp) {
      return realIp.trim();
    }
    return "0.0.0.0";
  }
}
