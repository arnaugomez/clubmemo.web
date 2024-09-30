import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ObjectId } from "mongodb";
import { getAdminResourceHook } from "../config/admin-resource-hooks-config";
import { getAdminResourceByType } from "../config/admin-resources-config";
import type { AdminResourceTypeModel } from "../models/admin-resource-model";
import {
  createValidationSchemaOfAdminResource,
  transformDataBeforeCreateOrUpdate,
} from "../models/admin-resource-model";
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
    const validationSchema = createValidationSchemaOfAdminResource(resource);
    const parsed = validationSchema.parse(data);
    const transformed = transformDataBeforeCreateOrUpdate(
      resource.fields,
      parsed,
    );
    const hook = getAdminResourceHook(resourceType);
    const dataAfterHook = await hook?.beforeUpdate?.(
      objectId,
      transformed,
      this.databaseService.client.db(),
    );
    await this.databaseService.client
      .db()
      .collection(resourceType)
      .updateOne({ _id: objectId }, { $set: dataAfterHook ?? transformed });
  }
}
