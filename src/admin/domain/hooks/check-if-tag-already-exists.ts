import type { Db, ObjectId } from "mongodb";
import { ZodError, ZodIssueCode } from "zod";
import type { AdminResourceData } from "../models/admin-resource-data";

/**
 * Checks if another tag with the same name already exists.
 * @param id The id of the tag to be updated. If null, it means that a new tag is being created.
 * @param data Tag data to be checked.
 * @param db Database connection.
 * @returns `void` if no other tag with the same name exists.
 * @throws {ZodError} if another tag with the same name already exists.
 */
export async function checkIfTagAlreadyExists(
  id: ObjectId | null,
  data: AdminResourceData,
  db: Db,
): Promise<void> {
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
