import {
  PaginationFacetTransformer,
  type PaginationFacet,
} from "@/src/common/data/facets/pagination-facet";
import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { PaginationModel } from "@/src/common/domain/models/pagination-model";
import { endOfDay, isDate, isValid, startOfDay } from "date-fns";
import escapeRegExp from "lodash/escapeRegExp";
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
        ...this.getPipelineFromJoins(resource),
        ...this.getPipelineFromFilters(resource, filters),
        ...this.getPipelineFromQuery(resource, query),
        ...(sortBy && sortOrder
          ? [
              {
                $sort: {
                  [this.getSortByKey(resource, sortBy)]:
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
      transformDataAfterGet(resource.fields, data, resource.joins ?? []),
    );
  }

  private getSortByKey(resource: AdminResourceModel, sortBy: string) {
    const join = resource.joins?.find((join) => join.name === sortBy);
    if (join) {
      return `${join.name}.display`;
    }
    return sortBy;
  }

  private getPipelineFromJoins(resource: AdminResourceModel) {
    return (
      resource.joins?.flatMap((join) => [
        {
          $lookup: {
            from: join.resourceType,
            let: { localField: `$${join.localField}` },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [`$${join.foreignField}`, "$$localField"],
                  },
                },
              },
              {
                $project: {
                  display: `$${join.displayField}`,
                },
              },
              {
                $limit: 1,
              },
            ],
            as: join.name,
          },
        },
        {
          $unwind: { path: `$${join.name}`, preserveNullAndEmptyArrays: true },
        },
      ]) ?? []
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

    for (const join of resource.joins ?? []) {
      match.push({
        [`${join.name}.display`]: { $regex: escaped, $options: "i" },
      });
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
          if (typeof value === "string" || isDate(value)) {
            if (isValid(value)) {
              match.push({
                [field.name]: {
                  $gte: startOfDay(value),
                  $lte: endOfDay(value),
                },
              });
            }
          }
          break;
        case AdminFieldTypeModel.number:
          if (typeof value === "number" && !isNaN(value)) {
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

    for (const join of resource.joins ?? []) {
      const value = filters[join.name];
      if (value === undefined) continue;
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed) {
          const escaped = escapeRegExp(trimmed);
          match.push({
            [`${join.name}.display`]: { $regex: escaped, $options: "i" },
          });
        }
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
