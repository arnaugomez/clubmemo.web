import { z } from "../i18n/zod";
const checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

/**
 * Validates a string as a MongoDB BSON ObjectId.
 * A valid ObjectId is a 24-character hexadecimal string.
 */
export const ObjectIdSchema = z.string().refine(
  // It would be nice to import ObjectId from mongodb, but it's not possible
  // because on the client it throws an error. I also tried importing bson but
  // it didn't work either. So I had to use a regex to validate the ObjectId.
  (workingId) => workingId.length === 24 && checkForHexRegExp.test(workingId),
  {
    params: { i18n: "objectId" },
  },
);
