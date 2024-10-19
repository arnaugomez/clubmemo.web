import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ObjectId } from "mongodb";
import { getAdminResourceHook } from "../config/admin-resource-hooks-config";
import { getAdminResourceSchema } from "../config/admin-resource-schemas-config";
import { getAdminResourceByType } from "../config/admin-resources-config";
import { saveNewAdminResourceTags } from "../methods/handle-admin-tags-field";
import { transformDataBeforeCreateOrUpdate } from "../methods/transform-data-before-create-or-update";
import type { AdminResourceTypeModel } from "../models/admin-resource-model";
import type { CheckIsAdminUseCase } from "./check-is-admin-use-case";

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
export class UpdateAdminResourceUseCase {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly checkIsAdminUseCase: CheckIsAdminUseCase,
  ) {}

  /**
   * Updates the values of a document in the database. For example, updates the
   * email of the user. This use case is only accessible to admin users from the
   * admin panel.
   * @returns {Promise<void>} Does not return the updated document.
   */
  async execute({
    resourceType,
    id,
    data,
  }: UpdateAdminResourceUseCaseInputModel): Promise<void> {
    await this.checkIsAdminUseCase.execute();
    const objectId = new ObjectId(id);
    const resource = getAdminResourceByType(resourceType);
    const validationSchema = getAdminResourceSchema({
      resourceType,
      isCreate: false,
    });
    const parsed = validationSchema.parse(data);
    const transformed = transformDataBeforeCreateOrUpdate(
      resource.fields,
      parsed,
    );
    const hook = getAdminResourceHook(resourceType);
    const db = this.databaseService.client.db();
    const dataAfterHook =
      (await hook?.beforeUpdate?.(objectId, transformed, db)) ?? transformed;
    await Promise.all([
      db
        .collection(resourceType)
        .updateOne({ _id: objectId }, { $set: dataAfterHook }),
      saveNewAdminResourceTags({
        data: dataAfterHook,
        resource: resource,
      }),
    ]);
  }
}
