import { ObjectId } from "mongodb";
import { z } from "../i18n/zod";

export const ObjectIdSchema = z.string().refine(ObjectId.isValid, {
  params: { i18n: "objectId" },
});
