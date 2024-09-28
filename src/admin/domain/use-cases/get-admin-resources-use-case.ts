import {
  PaginationFacetTransformer,
  type PaginationFacet,
} from "@/src/common/data/facets/pagination-facet";
import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { PaginationModel } from "@/src/common/domain/models/pagination-model";
import type { Document, WithId } from "mongodb";
import { getAdminResourceByType } from "../config/admin-resources-config";
import type { AdminResourceData } from "../models/admin-resource-data";
import {
  transformDataAfterGet,
  type AdminResourceTypeModel,
} from "../models/admin-resource-model";

interface GetAdminResourceDetailUseCaseInputModel {
  resourceType: AdminResourceTypeModel;
  page: number;
  pageSize: number;
}

export class GetAdminResourceDetailUseCase {
  constructor(private readonly databaseService: DatabaseService) {}

  async createAdminResourceUseCase({
    resourceType,
    page = 1,
    pageSize = 10,
  }: GetAdminResourceDetailUseCaseInputModel): Promise<
    PaginationModel<AdminResourceData>
  > {
    const resource = getAdminResourceByType(resourceType);
    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    const aggregation = this.databaseService.client
      .db()
      .collection(resourceType)
      .aggregate<PaginationFacet<WithId<Document>>>([
        // TODO: search and sort pagination query
        // {
        //   $match: {
        //   },
        // },
        // {
        //   $sort: { createdAt: -1 },
        // },
        {
          $facet: {
            metadata: [{ $count: "totalCount" }],
            results: [{ $skip: skip }, { $limit: limit }],
          },
        },
        {
          $unwind: "$metadata",
        },
      ]);

    const result = await aggregation.tryNext();
    if (!result) {
      return PaginationModel.empty();
    }
    return new PaginationFacetTransformer(result).toDomain((data) =>
      transformDataAfterGet(resource.fields, data),
    );
  }
}