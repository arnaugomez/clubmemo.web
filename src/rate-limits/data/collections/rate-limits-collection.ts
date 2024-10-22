import { collection } from "@/src/common/data/utils/mongodb";

export interface RateLimitDoc {
  name: string;
  count: number;
  updatedAt: Date;
}

/**
 * Collection of MongoDB documents of type `RateLimitDoc`
 */
export const rateLimitsCollection = collection<RateLimitDoc>()("rateLimits");
