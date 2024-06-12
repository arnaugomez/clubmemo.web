import type { Cookie } from "lucia";
import type { CheckSessionModel } from "../models/check-session-model";

/**
 * Service that provides authentication and authorization for the users. Manages
 * the sessions of the users.
 */
export interface AuthService {
  /**
   * Obtain the session of a user by its ID, checking if it exists and is still
   * valid.
   *
   * @param sessionId The ID of the session to validate. Is stored in a cookie.
   * The name of the cookie that contains the session id can be obtained with
   * the `getSessionCookieName` method.
   */
  validateSession(sessionId: string): Promise<CheckSessionModel>;

  /**
   * Makes the session invalid so that it can no longer be used to authenticate
   * the user.
   *
   * @param sessionId The ID of the session to invalidate.
   */
  invalidateSession(sessionId: string): Promise<void>;

  /**
   * Invalidates all the current sessions of a user so that they can no longer
   * be used to authenticate the user. This is useful when the user resets
   * their password. The user will have to log in again on all their devices.
   *
   * @param userId the id of the user
   */
  invalidateUserSessions(userId: string): Promise<void>;

  /**
   * Obtain the name of the cookie that contains the session id.
   */
  getSessionCookieName(): string;

  /**
   * Creates a cookie that contains the session id of a user.
   *
   * Warning: it does not set the cookie in the API response. It only creates
   * the cookie object.
   *
   * @param sessionId The ID of the session to create a cookie for.
   */
  createSessionCookie(sessionId: string): Cookie;

  /**
   * Creates an empty session cookie that cannot be used to authenticate any
   * user, signifying that the user is not logged in. Used to replace the
   * previous session cookie when the user logs out.
   */
  createBlankSessionCookie(): Cookie;

  /**
   * Logs in a user with their email and password. If the email and password
   * are valid, it creates a new session for the user and returns a session
   * cookie that can be used to authenticate the user in future requests.
   *
   * @param input The email and password of the user to log in
   * @returns The session cookie
   */
  loginWithPassword(input: LoginWithPasswordInputModel): Promise<Cookie>;

  /**
   * Creates a new user with an email and password. If the email is not already
   * in use, it creates a new user and logs them in, returning the id of the
   * user and a session cookie that can be used to authenticate the user in
   * future requests.
   *
   * @param input The email and password of the user to sign up
   */
  signupWithPassword(
    input: SignupWithPasswordInputModel,
  ): Promise<SignupWithPasswordResultModel>;

  /**
   * Sets the email of a user as verified.
   *
   * Then, it logs out the user from all their devices (for security reasons)
   * and creates a new session for the user. The cookie of the new session is
   * returned so that it can be used to authenticate the user in future
   * requests.
   *
   * When the user signs up, the email is not verified. The user must verify
   * their email before they can have full access to the platform.
   *
   * @param userId The id of the user to verify the email
   * @returns The cookie of the new session that is created after the email is
   * verified
   */
  verifyEmail(userId: string): Promise<Cookie>;

  /**
   * Changes the password of a user
   *
   * @param input the id of the user and the new password
   */
  updatePassword(input: UpdatePasswordInputModel): Promise<void>;

  /**
   * Checks that the password of a user is correct. If not, it throws
   * `IncorrectPasswordError`.
   *
   * @param input the user id and the password to check
   */
  checkPasswordIsCorrect(input: CheckPasswordInputModel): Promise<void>;

  /**
   * Invalidates all the current sessions of a user so that they can no longer
   * be used to authenticate the user. Then, creates a new session for the user
   * and returns the cookie of the new session.
   *
   * This is useful when the user changes their password. The user will have to
   * log in again on all their other devices.
   *
   * @param userId the id of the user
   * @returns The cookie of the new session that is created after invalidating
   * all the current sessions of the user
   */
  resetSessions(userId: string): Promise<Cookie>;
}

export interface LoginWithPasswordInputModel {
  email: string;
  password: string;
}

export interface SignupWithPasswordInputModel {
  email: string;
  password: string;
  acceptTerms: boolean;
}

export interface SignupWithPasswordResultModel {
  sessionCookie: Cookie;
  userId: string;
}

export interface UpdatePasswordInputModel {
  userId: string;
  password: string;
}

export interface CheckPasswordInputModel {
  userId: string;
  password: string;
}
