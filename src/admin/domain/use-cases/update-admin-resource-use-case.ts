import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import { ObjectId } from "mongodb";
import { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ExternalServiceError } from "@/src/common/effect/errors";
import { TagsRepository } from "@/src/tags/domain/interfaces/tags-repository";
import { AdminResourceHooks } from "../config/admin-resource-hooks-config";
import { getAdminResourceSchema } from "../config/admin-resource-schemas-config";
import { getAdminResourceByType } from "../config/admin-resources-config";
import { saveNewAdminResourceTags } from "../methods/handle-admin-tags-field";
import { transformDataBeforeCreateOrUpdate } from "../methods/transform-data-before-create-or-update";
import type { AdminResourceTypeModel } from "../models/admin-resource-model";
import { CheckIsAdminUseCase } from "./check-is-admin-use-case";

export interface UpdateAdminResourceUseCaseInputModel {
  resourceType: AdminResourceTypeModel;
  id: string;
  data: unknown;
}

/**
 * Updates the values of a document in the database. For example, updates the
 * email of the user. This use case is only accessible to admin users from the
 * admin panel.
 */
export class UpdateAdminResourceUseCase extends Context.Service<UpdateAdminResourceUseCase>()(
  "clubmemo/admin/domain/use-cases/update-admin-resource-use-case",
  {
    make: Effect.gen(function* () {
      const databaseService = yield* DatabaseService;
      const checkIsAdminUseCase = yield* CheckIsAdminUseCase;
      const adminHooks = yield* AdminResourceHooks;
      const tagsRepository = yield* TagsRepository;
      const execute = Effect.fn("UpdateAdminResourceUseCase.execute")(
        function* ({
          resourceType,
          id,
          data,
        }: UpdateAdminResourceUseCaseInputModel) {
          yield* checkIsAdminUseCase.execute();
          const objectId = new ObjectId(id);
          const resource = getAdminResourceByType(resourceType);
          const validationSchema = getAdminResourceSchema({
            resourceType,
            isCreate: false,
          });
          const parsed =
            yield* Schema.decodeUnknownEffect(validationSchema)(data);
          const transformed = transformDataBeforeCreateOrUpdate(
            resource.fields,
            parsed,
          );
          const hook = adminHooks.get(resourceType);
          const db = databaseService.client.db();
          const dataAfterHook =
            (yield* hook?.beforeUpdate
              ? hook.beforeUpdate(objectId, transformed, db)
              : Effect.succeed(transformed)) ?? transformed;
          yield* Effect.all(
            [
              Effect.tryPromise({
                try: () =>
                  db
                    .collection(resourceType)
                    .updateOne({ _id: objectId }, { $set: dataAfterHook }),
                catch: (cause) =>
                  new ExternalServiceError({
                    operation: "UpdateAdminResourceUseCase.execute",
                    cause,
                  }),
              }),
              saveNewAdminResourceTags(tagsRepository, {
                data: dataAfterHook,
                resource: resource,
              }),
            ],
            { concurrency: "unbounded" },
          );
        },
      );
      return { execute };
    }),
  },
) {}

export const UpdateAdminResourceUseCaseService = UpdateAdminResourceUseCase;
