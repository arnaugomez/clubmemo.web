import type { Db, ObjectId } from "mongodb";
import { ZodError, ZodIssueCode } from "zod";
import type { AdminResourceData } from "../models/admin-resource-data";

export async function checkIfEmailAlreadyExists(
  id: ObjectId | null,
  data: AdminResourceData,
  db: Db,
) {
  const document = await db.collection("users").findOne({ email: data.email });
  if (document) {
    if (document._id.equals(id)) return;
    throw new ZodError([
      {
        path: ["email"],
        code: ZodIssueCode.custom,
        params: { i18n: "userAlreadyExistsError" },
        message: "Ya existe un usuario con ese correo electrónico",
      },
    ]);
  }
}
