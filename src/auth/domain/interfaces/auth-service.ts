import type { Cookie } from "lucia";
import type { CheckSessionModel } from "../models/check-session-model";

export interface LoginWithPasswordInputModel {
  email: string;
  password: string;
}

export interface SignupWithPasswordInputModel {
  email: string;
  password: string;
}

export interface SignupWithPasswordResultModel {
  sessionCookie: Cookie;
  userId: string;
}

export interface UpdatePasswordModel {
  userId: string;
  password: string;
}

export interface CheckPasswordModel {
  userId: string;
  password: string;
}

export interface AuthService {
  validateSession(sessionId: string): Promise<CheckSessionModel>;

  invalidateSession(sessionId: string): Promise<void>;

  invalidateUserSessions(userId: string): Promise<void>;

  getSessionCookieName(): string;

  createSessionCookie(sessionId: string): Cookie;

  createBlankSessionCookie(): Cookie;

  loginWithPassword(input: LoginWithPasswordInputModel): Promise<Cookie>;

  signupWithPassword(
    input: SignupWithPasswordInputModel,
  ): Promise<SignupWithPasswordResultModel>;

  verifyEmail(userId: string): Promise<Cookie>;

  updatePassword(input: UpdatePasswordModel): Promise<void>;

  checkPasswordIsCorrect(input: CheckPasswordModel): Promise<void>;

  resetSessions(userId: string): Promise<Cookie>;
}
