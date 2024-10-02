import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ObjectId } from "mongodb";
import { getAdminResourceHook } from "../config/admin-resource-hooks-config";
import { getAdminResourceSchema } from "../config/admin-resource-schemas";
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

export class UpdateAdminResourceUseCase {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly checkIsAdminUseCase: CheckIsAdminUseCase,
  ) {}

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
