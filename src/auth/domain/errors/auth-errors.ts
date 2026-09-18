import * as Schema from "effect/Schema";
/**
 * Thrown when the user does not exist.
 */
export class UserDoesNotExistError extends Schema.TaggedError<UserDoesNotExistError>()(
  "UserDoesNotExistError",
  {},
) {}
/**
 * Thrown when the user already exists and should not exist
 */
export class UserAlreadyExistsError extends Schema.TaggedError<UserAlreadyExistsError>()(
  "UserAlreadyExistsError",
  {},
) {}
export class IncorrectPasswordError extends Schema.TaggedError<IncorrectPasswordError>()(
  "IncorrectPasswordError",
  {},
) {}
export class ForgotPasswordCodeExpiredError extends Schema.TaggedError<ForgotPasswordCodeExpiredError>()(
  "ForgotPasswordCodeExpiredError",
  {},
) {}
export class InvalidTokenError extends Schema.TaggedError<InvalidTokenError>()(
  "InvalidTokenError",
  {},
) {}
export class SessionExpiredError extends Schema.TaggedError<SessionExpiredError>()(
  "SessionExpiredError",
  {},
) {}
export class InvalidConfirmationError extends Schema.TaggedError<InvalidConfirmationError>()(
  "InvalidConfirmationError",
  {},
) {}
export class UserDoesNotAcceptTermsError extends Schema.TaggedError<UserDoesNotAcceptTermsError>()(
  "UserDoesNotAcceptTermsError",
  {},
) {}
