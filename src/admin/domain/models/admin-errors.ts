/**
 * Error that is thrown when a user tries to perform an action that requires
 * admin permissions, and the user is not an admin.
 */
export class UserIsNotAdminError extends Error {}
/**
 * Error that is thrown when a user tries to perform an operation on an admin
 * resource that is not included in the admin resources configuration, or on an
 * admin resource that does not exist.
 */
export class InvalidAdminResourceTypeError extends Error {}
