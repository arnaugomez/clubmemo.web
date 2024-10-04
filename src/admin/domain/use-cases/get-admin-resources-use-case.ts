import {
  PaginationFacetTransformer,
  type PaginationFacet,
} from "@/src/common/data/facets/pagination-facet";
import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { PaginationModel } from "@/src/common/domain/models/pagination-model";
import type { Document, WithId } from "mongodb";
import { SortOrderDataModelTransformer } from "../../data/models/sort-order-data-model";
import { getAdminResourceByType } from "../config/admin-resources-config";
import type { AdminResourceData } from "../models/admin-resource-data";
import {
  transformDataAfterGet,
  type AdminResourceTypeModel,
} from "../models/admin-resource-model";
import type { SortOrderModel } from "../models/sort-order-model";
import type { CheckIsAdminUseCase } from "./check-is-admin-use-case";

export interface GetAdminResourcesUseCaseInputModel {
  resourceType: AdminResourceTypeModel;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: SortOrderModel;
}

export class GetAdminResourcesUseCase {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly checkIsAdminUseCase: CheckIsAdminUseCase,
  ) {}

  async execute({
    resourceType,
    page = 1,
    pageSize = 10,
    sortBy,
    sortOrder,
  }: GetAdminResourcesUseCaseInputModel): Promise<
    PaginationModel<AdminResourceData>
  > {
    await this.checkIsAdminUseCase.execute();
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
        ...(sortBy && sortOrder
          ? [
              {
                $sort: {
                  [sortBy]:
                    SortOrderDataModelTransformer.fromDomainModel(sortOrder),
                },
              },
            ]
          : []),
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
