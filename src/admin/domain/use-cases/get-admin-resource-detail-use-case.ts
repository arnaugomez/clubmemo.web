import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { ObjectId } from "mongodb";
import { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ExternalServiceError } from "@/src/common/effect/errors";
import { getAdminResourceByType } from "../config/admin-resources-config";
import type { AdminResourceTypeModel } from "../models/admin-resource-model";
import { transformDataAfterGet } from "../models/admin-resource-model";
import { CheckIsAdminUseCase } from "./check-is-admin-use-case";

export interface GetAdminResourceDetailUseCaseInputModel {
  resourceType: AdminResourceTypeModel;
  id: string;
}

/**
 * Gets the details of a resource from the database. For example, gets the details
 * of a user. This use case is only accessible to admin users from the admin panel.
 */
export class GetAdminResourceDetailUseCase extends Context.Service<GetAdminResourceDetailUseCase>()(
  "clubmemo/admin/domain/use-cases/get-admin-resource-detail-use-case",
  {
    make: Effect.gen(function* () {
      const databaseService = yield* DatabaseService;
      const checkIsAdminUseCase = yield* CheckIsAdminUseCase;
      const execute = Effect.fn("GetAdminResourceDetailUseCase.execute")(
        function* ({
          resourceType,
          id,
        }: GetAdminResourceDetailUseCaseInputModel) {
          yield* checkIsAdminUseCase.execute();
          const objectId = new ObjectId(id);
          const resource = getAdminResourceByType(resourceType);
          const data = yield* Effect.tryPromise({
            try: () =>
              databaseService.client
                .db()
                .collection(resourceType)
                .findOne({ _id: objectId }),
            catch: (cause) =>
              new ExternalServiceError({
                operation: "GetAdminResourceDetailUseCase.execute",
                cause,
              }),
          });
          if (!data) return null;
          return transformDataAfterGet(resource.fields, data, []);
        },
      );
      return { execute };
    }),
  },
) {}

export const GetAdminResourceDetailUseCaseService =
  GetAdminResourceDetailUseCase;
