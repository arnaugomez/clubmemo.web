import * as Effect from "effect/Effect";
import type { Db, ObjectId } from "mongodb";
import {
  ExternalServiceError,
  FieldValidationError,
} from "@/src/common/effect/errors";
import type { AdminResourceData } from "../models/admin-resource-data";

/**
 * Checks if another user with the same email already exists.
 * @param id The id of the user to be updated. If null, it means that a new user is being created.
 * @param data User data to be checked.
 * @returns `void` if no other user with the same email exists.
 * @throws {FieldValidationError} if another user with the same email already exists
 */
export const checkIfEmailAlreadyExists = Effect.fn("checkIfEmailAlreadyExists")(
  function* (id: ObjectId | null, data: AdminResourceData, db: Db) {
    const document = yield* Effect.tryPromise({
      try: () => db.collection("users").findOne({ email: data.email }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "checkIfEmailAlreadyExists",
          cause,
        }),
    });
    if (document) {
      if (document._id.equals(id)) return;
      return yield* Effect.fail(
        new FieldValidationError({
          path: "email",
          message: "Ya existe un usuario con ese correo electrónico",
        }),
      );
    }
  },
);
