import * as Effect from "effect/Effect";
import type { Db, ObjectId } from "mongodb";
import {
  ExternalServiceError,
  FieldValidationError,
} from "@/src/common/effect/errors";
import type { AdminResourceData } from "../models/admin-resource-data";

/**
 * Checks if another profile with the same handle already exists.
 *
 * @param id Id of the profile to be updated. If null, it means that a new profile is being created.
 * @param data Profile data to be checked.
 * @param db Database connection.
 * @returns `void` if no other profile with the same handle exists.
 * @throws {FieldValidationError} if another profile with the same handle already exists.
 */
export const checkIfHandleAlreadyExists = Effect.fn(
  "checkIfHandleAlreadyExists",
)(function* (id: ObjectId | null, data: AdminResourceData, db: Db) {
  const document = yield* Effect.tryPromise({
    try: () => db.collection("profiles").findOne({ handle: data.handle }),
    catch: (cause) =>
      new ExternalServiceError({
        operation: "checkIfHandleAlreadyExists",
        cause,
      }),
  });
  if (document) {
    if (document._id.equals(id)) return;
    return yield* Effect.fail(
      new FieldValidationError({
        path: "handle",
        message: "Ya existe un identificador de usuario con ese nombre",
      }),
    );
  }
});
