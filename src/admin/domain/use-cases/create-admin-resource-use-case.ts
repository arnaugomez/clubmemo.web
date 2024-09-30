import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { getAdminResourceHook } from "../config/admin-resource-hooks-config";
import { getAdminResourceByType } from "../config/admin-resources-config";
import type { AdminResourceTypeModel } from "../models/admin-resource-model";
import {
  createValidationSchemaOfAdminResource,
  transformDataBeforeCreateOrUpdate,
} from "../models/admin-resource-model";
import type { CheckIsAdminUseCase } from "./check-is-admin-use-case";

export interface CreateAdminResourceUseCaseInputModel {
  resourceType: AdminResourceTypeModel;
  data: unknown;
}

interface CreateAdminResourceUseCaseResultModel {
  id: string;
}

export class CreateAdminResourceUseCase {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly checkIsAdminUseCase: CheckIsAdminUseCase,
  ) {}

  async execute({
    resourceType,
    data,
  }: CreateAdminResourceUseCaseInputModel): Promise<CreateAdminResourceUseCaseResultModel> {
    await this.checkIsAdminUseCase.execute();
    const resource = getAdminResourceByType(resourceType);
    const validationSchema = createValidationSchemaOfAdminResource(resource);
    const parsed = validationSchema.parse(data);
    const transformed = transformDataBeforeCreateOrUpdate(
      resource.fields,
      parsed,
    );
    const hook = getAdminResourceHook(resourceType);
    const db = this.databaseService.client.db();
    const dataAfterHook = await hook?.beforeCreate?.(transformed, db);
    const { insertedId } = await db
      .collection(resourceType)
      .insertOne(dataAfterHook ?? transformed);
    return { id: insertedId.toString() };
  }
}
