import { collection } from "@/src/core/app/utils/mongo";
import { ObjectId } from "mongodb";

export interface SessionDoc {
  expires_at: Date;
  user_id: ObjectId;
}

export const sessionsCollection = collection<SessionDoc>("sessions");
