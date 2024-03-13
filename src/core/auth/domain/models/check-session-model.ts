import { Session, User } from "lucia";

export type CheckSessionModel =
  | {
      user: User;
      session: Session;
    }
  | {
      user: null;
      session: null;
    };
