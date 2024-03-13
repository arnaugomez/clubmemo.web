import { db } from "@/src/core/app/data/services/mongodb-service-impl";
import { ObjectId } from "mongodb";

export interface SessionDoc {
  expires_at: Date;
  user_id: ObjectId;
}

export const sessionsCollection = db.collection<SessionDoc>("sessions");
