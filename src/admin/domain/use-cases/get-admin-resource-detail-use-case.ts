import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ObjectId } from "mongodb";
import { getAdminResourceByType } from "../config/admin-resources-config";
import type { AdminResourceData } from "../models/admin-resource-data";
import type { AdminResourceTypeModel } from "../models/admin-resource-model";
import { transformDataAfterGet } from "../models/admin-resource-model";
import type { CheckIsAdminUseCase } from "./check-is-admin-use-case";

interface GetAdminResourceDetailUseCaseInputModel {
  resourceType: AdminResourceTypeModel;
  id: string;
}

export class GetAdminResourceDetailUseCase {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly checkIsAdminUseCase: CheckIsAdminUseCase,
  ) {}

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
    return transformDataAfterGet(resource.fields, data);
  }
}
