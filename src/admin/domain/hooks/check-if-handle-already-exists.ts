import type { Db, ObjectId } from "mongodb";
import { ZodError, ZodIssueCode } from "zod";
import type { AdminResourceData } from "../models/admin-resource-data";

export async function checkIfHandleAlreadyExists(
  id: ObjectId | null,
  data: AdminResourceData,
  db: Db,
) {
  const document = await db
    .collection("profiles")
    .findOne({ handle: data.handle });
  if (document) {
    if (document._id.equals(id)) return;
    throw new ZodError([
      {
        path: ["name"],
        code: ZodIssueCode.custom,
        params: { i18n: "handleAlreadyExists" },
        message: "Ya existe un identificador de usuario con ese nombre",
      },
    ]);
  }
}
