/**
 * Occurs when you try to assign a handle to aprofile but the handle is already
 * in use.
 */
export class HandleAlreadyExistsError extends Error {}
/**
 * Occurs when you try to get a profile but it does not exist
 */
export class ProfileDoesNotExistError extends Error {}
