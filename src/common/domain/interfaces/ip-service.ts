import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import type { ExternalServiceError } from "@/src/common/effect/errors";
/**
 * Service to manage the IP address of the user (i.e., the client making the
 * request)
 */
export interface IpService {
  /**
   * Gets the IP address of the user (i.e., the client making the request)
   * @returns The IP address of the user, or "0.0.0.0" if it could not be
   * detected
   */
  getIp(): Effect.Effect<string, ExternalServiceError>;
}

export const IpService = Context.Service<IpService>(
  "clubmemo/common/domain/interfaces/ip-service/IpService",
);
