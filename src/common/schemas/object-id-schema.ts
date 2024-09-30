import { z } from "../i18n/zod";
const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');

export const ObjectIdSchema = z.string().refine(workingId => workingId.length === 24 && checkForHexRegExp.test(workingId), {
  params: { i18n: "objectId" },
});
