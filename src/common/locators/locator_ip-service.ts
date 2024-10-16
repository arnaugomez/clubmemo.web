import { IpServiceVercelImpl } from "../data/services/ip-service-vercel-impl";
import type { Dependency } from "../di/locator-types";
import { singleton } from "../di/locator-utils";
import type { IpService } from "../domain/interfaces/ip-service";

export const locator_common_IpService: Dependency<IpService> = singleton(
  () => new IpServiceVercelImpl(),
);
