import type { Db } from "mongodb";
import { ZodError, ZodIssueCode } from "zod";
import type { AdminResourceData } from "../models/admin-resource-data";

export async function checkIfTagAlreadyExists(data: AdminResourceData, db: Db) {
  const document = await db.collection("tags").findOne({ name: data.name });
  if (document) {
    if (document._id.toString() === data._id) return;
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
