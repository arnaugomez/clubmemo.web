import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { getAdminResourceHook } from "../config/admin-resource-hooks-config";
import { getAdminResourceSchema } from "../config/admin-resource-schemas-config";
import { getAdminResourceByType } from "../config/admin-resources-config";
import { saveNewAdminResourceTags } from "../methods/handle-admin-tags-field";
import { transformDataBeforeCreateOrUpdate } from "../methods/transform-data-before-create-or-update";
import type { AdminResourceTypeModel } from "../models/admin-resource-model";
import type { CheckIsAdminUseCase } from "./check-is-admin-use-case";

export interface CreateAdminResourceUseCaseInputModel {
  resourceType: AdminResourceTypeModel;
  data: unknown;
}

interface CreateAdminResourceUseCaseResultModel {
  id: string;
}

/**
 * Creates a new instance of a resource of the database. For example, creates a
 * new user. This use case is only accessible to admin users from the admin
 * panel.
 */
export class CreateAdminResourceUseCase {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly checkIsAdminUseCase: CheckIsAdminUseCase,
  ) {}

  /**
   * Creates a new instance of a resource of the database. For example, creates a
   * new user. This use case is only accessible to admin users from the admin
   * panel.
   */
  async execute({
    resourceType,
    data,
  }: CreateAdminResourceUseCaseInputModel): Promise<CreateAdminResourceUseCaseResultModel> {
    await this.checkIsAdminUseCase.execute();
    const resource = getAdminResourceByType(resourceType);
    const validationSchema = getAdminResourceSchema({
      resourceType,
      isCreate: true,
    });
    const parsed = validationSchema.parse(data);
    const transformed = transformDataBeforeCreateOrUpdate(
      resource.fields,
      parsed,
    );
    const hook = getAdminResourceHook(resourceType);
    const db = this.databaseService.client.db();
    const dataAfterHook =
      (await hook?.beforeCreate?.(transformed, db)) ?? transformed;
    const [{ insertedId }] = await Promise.all([
      db.collection(resourceType).insertOne(dataAfterHook),
      saveNewAdminResourceTags({
        data: dataAfterHook,
        resource: resource,
      }),
    ]);
    return { id: insertedId.toString() };
  }
}
