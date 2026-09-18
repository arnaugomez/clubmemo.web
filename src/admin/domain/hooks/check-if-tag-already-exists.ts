import * as Effect from "effect/Effect";
import type { Db, ObjectId } from "mongodb";
import {
  ExternalServiceError,
  FieldValidationError,
} from "@/src/common/effect/errors";
import type { AdminResourceData } from "../models/admin-resource-data";

/**
 * Checks if another tag with the same name already exists.
 * @param id The id of the tag to be updated. If null, it means that a new tag is being created.
 * @param data Tag data to be checked.
 * @param db Database connection.
 * @returns `void` if no other tag with the same name exists.
 * @throws {FieldValidationError} if another tag with the same name already exists.
 */
export const checkIfTagAlreadyExists = Effect.fn("checkIfTagAlreadyExists")(
  function* (id: ObjectId | null, data: AdminResourceData, db: Db) {
    const document = yield* Effect.tryPromise({
      try: () => db.collection("tags").findOne({ name: data.name }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "checkIfTagAlreadyExists",
          cause,
        }),
    });
    if (document) {
      if (document._id.equals(id)) return;
      return yield* Effect.fail(
        new FieldValidationError({
          path: "name",
          message: "Ya existe una etiqueta con ese nombre",
        }),
      );
    }
  },
);
