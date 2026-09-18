import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
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

export interface CreateAdminResourceUseCaseInputModel {
  resourceType: AdminResourceTypeModel;
  data: unknown;
}

/**
 * Creates a new instance of a resource of the database. For example, creates a
 * new user. This use case is only accessible to admin users from the admin
 * panel.
 */
export class CreateAdminResourceUseCase extends Context.Service<CreateAdminResourceUseCase>()(
  "clubmemo/admin/domain/use-cases/create-admin-resource-use-case",
  {
    make: Effect.gen(function* () {
      const databaseService = yield* DatabaseService;
      const checkIsAdminUseCase = yield* CheckIsAdminUseCase;
      const adminHooks = yield* AdminResourceHooks;
      const tagsRepository = yield* TagsRepository;
      const execute = Effect.fn("CreateAdminResourceUseCase.execute")(
        function* ({
          resourceType,
          data,
        }: CreateAdminResourceUseCaseInputModel) {
          yield* checkIsAdminUseCase.execute();
          const resource = getAdminResourceByType(resourceType);
          const validationSchema = getAdminResourceSchema({
            resourceType,
            isCreate: true,
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
            (yield* hook?.beforeCreate
              ? hook.beforeCreate(transformed, db)
              : Effect.succeed(transformed)) ?? transformed;
          const [{ insertedId }] = yield* Effect.all(
            [
              Effect.tryPromise({
                try: () => db.collection(resourceType).insertOne(dataAfterHook),
                catch: (cause) =>
                  new ExternalServiceError({
                    operation: "CreateAdminResourceUseCase.execute",
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
          return { id: insertedId.toString() };
        },
      );
      return { execute };
    }),
  },
) {}

export const CreateAdminResourceUseCaseService = CreateAdminResourceUseCase;
