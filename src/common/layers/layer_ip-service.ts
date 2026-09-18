import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { IpServiceVercelImpl } from "../data/services/ip-service-vercel-impl";
import { IpService } from "../domain/interfaces/ip-service";

export { IpService };
export const IpServiceLive = Layer.effect(
  IpService,
  Effect.sync(() => {
    return new IpServiceVercelImpl();
  }),
);
