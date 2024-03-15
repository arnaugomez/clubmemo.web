import { UserModel } from "./user-model";

interface SessionModelData {
  id: string;
  expiresAt: Date;
  fresh: boolean;
  userId: string;
}

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

export const emptyCheckSession = {
  user: null,
  session: null,
};

export type CheckSessionModel =
  | {
      user: UserModel;
      session: SessionModel;
    }
  | typeof emptyCheckSession;
