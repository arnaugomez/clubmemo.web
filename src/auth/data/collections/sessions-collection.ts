import { collection } from "@/src/common/data/utils/mongo";
import type { Session } from "lucia";
import type { ObjectId } from "mongodb";
import { SessionModel } from "../../domain/models/check-session-model";

/**
 * MongoDB document representing the public fields of a user session.
 * The fields are in snake_case to facilitate interoperability with the Lucia authentication library
 */
export interface SessionDoc {
  expires_at: Date;
  user_id: ObjectId;
}

/**
 * Collection of MongoDB documents of type `SessionDoc`
 */
export const sessionsCollection = collection<SessionDoc>("sessions");

export class SessionTransformer {
  constructor(private readonly session: Session) {}

  toDomain(): SessionModel {
    return new SessionModel({
      id: this.session.id,
      expiresAt: this.session.expiresAt,
      fresh: this.session.fresh,
      userId: this.session.userId.toString(),
    });
  }
}
