import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ObjectId } from "mongodb";
import { getAdminResourceByType } from "../config/admin-resources-config";
import type { AdminResourceData } from "../models/admin-resource-data";
import type { AdminResourceTypeModel } from "../models/admin-resource-model";
import { transformDataAfterGet } from "../models/admin-resource-model";
import type { CheckIsAdminUseCase } from "./check-is-admin-use-case";

export interface GetAdminResourceDetailUseCaseInputModel {
  resourceType: AdminResourceTypeModel;
  id: string;
}

/**
 * Gets the details of a resource from the database. For example, gets the details
 * of a user. This use case is only accessible to admin users from the admin panel.
 */
export class GetAdminResourceDetailUseCase {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly checkIsAdminUseCase: CheckIsAdminUseCase,
  ) {}

  /**
   * Gets the details of a resource from the database. For example, gets the details
   * of a user. This use case is only accessible to admin users from the admin panel.
   * @throws {UserIsNotAdminError} If the user is not an admin.
   * @returns {Promise<AdminResourceData | null>} The details of the resource if
   * the resource exists, or null if the resource does not exist.
   */
  async execute({
    resourceType,
    id,
  }: GetAdminResourceDetailUseCaseInputModel): Promise<AdminResourceData | null> {
    await this.checkIsAdminUseCase.execute();
    const objectId = new ObjectId(id);
    const resource = getAdminResourceByType(resourceType);
    const data = await this.databaseService.client
      .db()
      .collection(resourceType)
      .findOne({ _id: objectId });
    if (!data) return null;
    return transformDataAfterGet(resource.fields, data, []);
  }
}
