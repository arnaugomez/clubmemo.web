import { Cookie } from "lucia";
import { ObjectId } from "mongodb";
import { CheckSessionModel } from "../models/check-session-model";

export interface LoginWithPasswordModel {
  email: string;
  password: string;
}

export interface SignupWithPasswordModel {
  email: string;
  password: string;
}

export interface SignupWithPasswordResultModel {
  sessionCookie: Cookie;
  userId: ObjectId;
}

export interface AuthService {
  validateSession(sessionId: string): Promise<CheckSessionModel>;

  invalidateSession(sessionId: string): Promise<void>;

  invalidateUserSessions(userId: ObjectId): Promise<void>;

  getSessionCookieName(): string;

  createSessionCookie(sessionId: string): Cookie;

  createBlankSessionCookie(): Cookie;

  loginWithPassword(input: LoginWithPasswordModel): Promise<Cookie>;

  signupWithPassword(
    input: SignupWithPasswordModel,
  ): Promise<SignupWithPasswordResultModel>;

  verifyEmail(userId: ObjectId): Promise<Cookie>;
}
