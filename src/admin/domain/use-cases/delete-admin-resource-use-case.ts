import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ObjectId } from "mongodb";
import { getAdminResourceHook } from "../config/admin-resource-hooks-config";
import { AdminResourceTypeModel } from "../models/admin-resource-model";
import type { CheckIsAdminUseCase } from "./check-is-admin-use-case";

export interface DeleteAdminResourceUseCaseInputModel {
  resourceType: AdminResourceTypeModel;
  id: string;
}

export class DeleteAdminResourceUseCase {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly checkIsAdminUseCase: CheckIsAdminUseCase,
  ) {}

  async execute({
    resourceType,
    id,
  }: DeleteAdminResourceUseCaseInputModel): Promise<void> {
    await this.checkIsAdminUseCase.execute();
    const objectId =
      resourceType === AdminResourceTypeModel.sessions
        ? (id as unknown as ObjectId)
        : new ObjectId(id);
    const db = this.databaseService.client.db();
    const data = await db.collection(resourceType).findOne({ _id: objectId });
    if (!data) return;
    const hook = getAdminResourceHook(resourceType);
    await db.collection(resourceType).deleteOne({ _id: objectId });
    await hook?.afterDelete?.(objectId, data, db);
  }
}
