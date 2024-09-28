import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ObjectId } from "mongodb";
import { getAdminResourceByType } from "../config/admin-resources-config";
import type { AdminResourceData } from "../models/admin-resource-data";
import type { AdminResourceTypeModel } from "../models/admin-resource-model";
import { transformDataAfterGet } from "../models/admin-resource-model";

interface GetAdminResourceDetailUseCaseInputModel {
  resourceType: AdminResourceTypeModel;
  id: string;
}

export class GetAdminResourceDetailUseCase {
  constructor(private readonly databaseService: DatabaseService) {}

  async createAdminResourceUseCase({
    resourceType,
    id,
  }: GetAdminResourceDetailUseCaseInputModel): Promise<AdminResourceData | null> {
    const objectId = new ObjectId(id);
    const resource = getAdminResourceByType(resourceType);
    const data = await this.databaseService.client
      .db()
      .collection(resourceType)
      .findOne({ _id: objectId });
    if (!data) return null;
    return transformDataAfterGet(resource.fields, data);
  }
}
