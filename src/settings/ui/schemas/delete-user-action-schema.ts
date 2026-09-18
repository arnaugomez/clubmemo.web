import * as Schema from "effect/Schema";

/**
 * Validates the parameters of `deleteUserAction`
 */
export const DeleteUserActionSchema = Schema.Struct({
  password: Schema.String,
  confirmation: Schema.String,
});

/**
 * Parameters of `deleteUserAction`
 */
export type DeleteUserActionModel = (typeof DeleteUserActionSchema)["Type"];
