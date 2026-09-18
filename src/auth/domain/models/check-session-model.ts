import * as Schema from "effect/Schema";

import type { UserModel } from "./user-model";

export const SessionModelDataSchema = Schema.Struct({
  id: Schema.mutableKey(Schema.String),
  expiresAt: Schema.mutableKey(Schema.Date),
  fresh: Schema.mutableKey(Schema.Boolean),
  userId: Schema.mutableKey(Schema.String),
});
export type SessionModelData = typeof SessionModelDataSchema.Type;

/**
 * A user session, meaning that a user is logged in
 */
export class SessionModel extends Schema.Class<SessionModel>("SessionModel")({
  data: SessionModelDataSchema,
}) {
  constructor(data: SessionModelData) {
    super({ data });
  }

  get id() {
    return this.data.id;
  }

  get expiresAt() {
    return this.data.expiresAt;
  }

  get fresh() {
    return this.data.fresh;
  }
}

/**
 * The result of checking if a user is logged in and seeing that the user is not
 * logged in
 */
export const emptyCheckSession = {
  user: null,
  session: null,
};

/**
 * The result of checking if a user is logged in
 */
export type CheckSessionModel =
  | {
      user: UserModel;
      session: SessionModel;
    }
  | typeof emptyCheckSession;
