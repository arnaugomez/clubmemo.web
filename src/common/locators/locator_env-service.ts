import { EnvServiceImpl } from "../data/services/env-service-impl";
import type { Dependency } from "../di/locator-types";
import { singleton } from "../di/locator-utils";
import type { EnvService } from "../domain/interfaces/env-service";

export const locator_common_EnvService: Dependency<EnvService> = singleton(
  () => new EnvServiceImpl(),
);
