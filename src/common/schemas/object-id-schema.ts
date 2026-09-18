import * as Schema from "effect/Schema";

const checkForHexRegExp = /^[0-9a-fA-F]{24}$/;

/**
 * Validates a string as a MongoDB BSON ObjectId.
 * A valid ObjectId is a 24-character hexadecimal string.
 */
export const ObjectIdSchema = Schema.String.check(
  Schema.makeFilter(
    (workingId) => workingId.length === 24 && checkForHexRegExp.test(workingId),
    { message: "No es un identificador (ObjectId) válido" },
  ),
);
