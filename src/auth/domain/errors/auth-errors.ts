/**
 * Thrown when the user does not exist.
 */
export class UserDoesNotExistError extends Error {}
/**
 * Thrown when the user already exists and should not exist
 */
export class UserAlreadyExistsError extends Error {}
export class IncorrectPasswordError extends Error {}
export class ForgotPasswordCodeExpiredError extends Error {}
export class InvalidTokenError extends Error {}
export class SessionExpiredError extends Error {}
export class InvalidConfirmationError extends Error {}
export class UserDoesNotAcceptTermsError extends Error {}
