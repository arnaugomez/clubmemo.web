import type { Db, ObjectId } from "mongodb";
import { ZodError, ZodIssueCode } from "zod";
import type { AdminResourceData } from "../models/admin-resource-data";

/**
 * Checks if another profile with the same handle already exists.
 *
 * @param id Id of the profile to be updated. If null, it means that a new profile is being created.
 * @param data Profile data to be checked.
 * @param db Database connection.
 * @returns `void` if no other profile with the same handle exists.
 * @throws {ZodError} if another profile with the same handle already exists.
 */
export async function checkIfHandleAlreadyExists(
  id: ObjectId | null,
  data: AdminResourceData,
  db: Db,
): Promise<void> {
  const document = await db
    .collection("profiles")
    .findOne({ handle: data.handle });
  if (document) {
    if (document._id.equals(id)) return;
    throw new ZodError([
      {
        path: ["handle"],
        code: ZodIssueCode.custom,
        params: { i18n: "handleAlreadyExists" },
        message: "Ya existe un identificador de usuario con ese nombre",
      },
    ]);
  }
}
