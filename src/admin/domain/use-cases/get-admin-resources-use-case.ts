import {
  PaginationFacetTransformer,
  type PaginationFacet,
} from "@/src/common/data/facets/pagination-facet";
import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { PaginationModel } from "@/src/common/domain/models/pagination-model";
import { escapeRegExp, isDate } from "lodash-es";
import { ObjectId, type Document, type WithId } from "mongodb";
import { SortOrderDataModelTransformer } from "../../data/models/sort-order-data-model";
import { getAdminResourceByType } from "../config/admin-resources-config";
import type { AdminResourceData } from "../models/admin-resource-data";
import type { AdminResourceModel } from "../models/admin-resource-model";
import {
  AdminFieldTypeModel,
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
  query?: string;
  filters?: Record<string, unknown>;
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
    query,
    filters,
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
        ...this.getPipelineFromFilters(resource, filters),
        ...this.getPipelineFromQuery(resource, query),
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

  private getPipelineFromQuery(
    resource: AdminResourceModel,
    query?: string,
  ): Document[] {
    const trimmed = query?.trim();
    if (!trimmed) {
      return [];
    }
    const escaped = escapeRegExp(trimmed);
    const match = [];
    for (const field of resource.fields) {
      if (
        field.fieldType === AdminFieldTypeModel.string ||
        field.fieldType === AdminFieldTypeModel.richText
      ) {
        match.push({ [field.name]: { $regex: escaped, $options: "i" } });
      }
    }

    if (!match.length) {
      return [];
    }

    return [
      {
        $match: { $or: match },
      },
    ];
  }
  private getPipelineFromFilters(
    resource: AdminResourceModel,
    filters?: Record<string, unknown>,
  ): Document[] {
    if (!filters) {
      return [];
    }
    console.log(filters);

    const match = [];
    for (const field of resource.fields) {
      const value = filters[field.name];
      if (value === undefined) continue;
      switch (field.fieldType) {
        case AdminFieldTypeModel.string || AdminFieldTypeModel.richText:
          if (typeof value === "string") {
            const trimmed = value.trim();
            if (trimmed) {
              const escaped = escapeRegExp(trimmed);
              match.push({ [field.name]: { $regex: escaped, $options: "i" } });
            }
          }
          break;
        case AdminFieldTypeModel.boolean:
          if (typeof value === "boolean") {
            match.push({ [field.name]: { $eq: value } });
          }
          break;
        case AdminFieldTypeModel.date:
          if (isDate(value)) {
            match.push({ [field.name]: { $eq: value } });
          }
          break;
        case AdminFieldTypeModel.number:
          if (typeof value === "number") {
            match.push({ [field.name]: { $eq: value } });
          }
          break;
        case AdminFieldTypeModel.select:
          if (typeof value === "string") {
            match.push({ [field.name]: { $eq: value } });
          }
          break;
        case AdminFieldTypeModel.tags || AdminFieldTypeModel.selectMultiple:
          if (Array.isArray(value) && value.length) {
            match.push({ [field.name]: { $all: value } });
          }
          break;
        case AdminFieldTypeModel.objectId:
          if (typeof value == "string" && ObjectId.isValid(value)) {
            match.push({ [field.name]: { $eq: new ObjectId(value) } });
          }
          break;
      }
    }

    if (!match.length) {
      return [];
    }

    return [
      {
        $match: { $and: match },
      },
    ];
  }
}
