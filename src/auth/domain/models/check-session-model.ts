import type { UserModel } from "./user-model";

export interface SessionModelData {
  id: string;
  expiresAt: Date;
  fresh: boolean;
  userId: string;
}

/**
 * A user session, meaning that a user is logged in
 */
export class SessionModel {
  constructor(private data: SessionModelData) {}

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
