import type { Db, ObjectId } from "mongodb";
import { ZodError, ZodIssueCode } from "zod";
import type { AdminResourceData } from "../models/admin-resource-data";

export async function checkIfTagAlreadyExists(
  id: ObjectId | null,
  data: AdminResourceData,
  db: Db,
) {
  const document = await db.collection("tags").findOne({ name: data.name });
  if (document) {
    if (document._id.equals(id)) return;
    throw new ZodError([
      {
        path: ["name"],
        code: ZodIssueCode.custom,
        params: { i18n: "tagAlreadyExists" },
        message: "Ya existe una etiqueta con ese nombre",
      },
    ]);
  }
}
