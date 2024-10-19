import type { Db, ObjectId } from "mongodb";
import { ZodError, ZodIssueCode } from "zod";
import type { AdminResourceData } from "../models/admin-resource-data";

/**
 * Checks if another user with the same email already exists.
 * @param id The id of the user to be updated. If null, it means that a new user is being created.
 * @param data User data to be checked.
 * @returns `void` if no other user with the same email exists.
 * @throws {ZodError} if another user with the same email already exists
 */
export async function checkIfEmailAlreadyExists(
  id: ObjectId | null,
  data: AdminResourceData,
  db: Db,
): Promise<void> {
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
