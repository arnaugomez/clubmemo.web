import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { ObjectId } from "mongodb";
import { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ExternalServiceError } from "@/src/common/effect/errors";
import { AdminResourceHooks } from "../config/admin-resource-hooks-config";
import { AdminResourceTypeModel } from "../models/admin-resource-model";
import { CheckIsAdminUseCase } from "./check-is-admin-use-case";

export interface DeleteAdminResourceUseCaseInputModel {
  resourceType: AdminResourceTypeModel;
  /**
   * The ID of the resource to delete. Should be the string representation of a
   * valid ObjectId, unless the resource is a session, in which case it should be
   * a string.
   */
  id: string;
}

/**
 * Deletes an instance of a resource from the database. For example, deletes a
 * user record from the database. This use case is only accessible to admin
 * users from the admin panel.
 */
export class DeleteAdminResourceUseCase extends Context.Service<DeleteAdminResourceUseCase>()(
  "clubmemo/admin/domain/use-cases/delete-admin-resource-use-case",
  {
    make: Effect.gen(function* () {
      const databaseService = yield* DatabaseService;
      const checkIsAdminUseCase = yield* CheckIsAdminUseCase;
      const adminHooks = yield* AdminResourceHooks;
      const execute = Effect.fn("DeleteAdminResourceUseCase.execute")(
        function* ({ resourceType, id }: DeleteAdminResourceUseCaseInputModel) {
          yield* checkIsAdminUseCase.execute();
          const objectId =
            resourceType === AdminResourceTypeModel.sessions
              ? (id as unknown as ObjectId)
              : new ObjectId(id);
          const db = databaseService.client.db();
          const data = yield* Effect.tryPromise({
            try: () => db.collection(resourceType).findOne({ _id: objectId }),
            catch: (cause) =>
              new ExternalServiceError({
                operation: "DeleteAdminResourceUseCase.execute",
                cause,
              }),
          });
          if (!data) return;
          const hook = adminHooks.get(resourceType);
          yield* Effect.tryPromise({
            try: () => db.collection(resourceType).deleteOne({ _id: objectId }),
            catch: (cause) =>
              new ExternalServiceError({
                operation: "DeleteAdminResourceUseCase.execute",
                cause,
              }),
          });
          yield* hook?.afterDelete
            ? hook.afterDelete(objectId, data, db)
            : Effect.void;
        },
      );
      return { execute };
    }),
  },
) {}

export const DeleteAdminResourceUseCaseService = DeleteAdminResourceUseCase;
