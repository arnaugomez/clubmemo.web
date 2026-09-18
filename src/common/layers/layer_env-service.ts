import * as Layer from "effect/Layer";
import { applicationConfig } from "../data/services/env-service-impl";
import { EnvService } from "../domain/interfaces/env-service";

export { EnvService };
export const EnvServiceLive = Layer.effect(EnvService, applicationConfig);
