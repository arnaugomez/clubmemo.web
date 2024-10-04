import { z } from "zod";
import { SortOrderModel } from "../../domain/models/sort-order-model";
import { AdminResourceTypeSchema } from "./admin-resource-type-schema";

export const GetAdminResourcesActionSchema = z.object({
  resourceType: AdminResourceTypeSchema,
  page: z.number().int().positive().min(1),
  pageSize: z.number().int().positive().min(1).max(100),
  sortBy: z.string().optional(),
  sortOrder: z
    .enum([SortOrderModel.ascending, SortOrderModel.descending])
    .optional(),
  query: z.string().optional(),
  filters: z.record(z.unknown()).optional(),
});
