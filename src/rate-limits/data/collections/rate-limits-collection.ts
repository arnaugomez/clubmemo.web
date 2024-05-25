import { collection } from "@/src/common/data/utils/mongo";

export interface RateLimitDoc {
  name: string;
  count: number;
  updatedAt: Date;
}

export const rateLimitsCollection = collection<RateLimitDoc>("rateLimits");
