import * as Effect from "effect/Effect";
import type { TagsRepository } from "@/src/tags/domain/interfaces/tags-repository";
import type { AdminResourceData } from "../models/admin-resource-data";
import type { AdminResourceModel } from "../models/admin-resource-model";
import { AdminFieldTypeModel } from "../models/admin-resource-model";

interface SaveNewAdminResourceTagsParams {
  /**
   * Data of the updated or created resource.
   */
  data: AdminResourceData;
  /**
   * Configuration of the admin resource
   */
  resource: AdminResourceModel;
}

/**
 * Creates new tags in the database when a new resource is created or edited,
 * and it contains a field with a list of tags.
 */
export const saveNewAdminResourceTags = Effect.fn("saveNewAdminResourceTags")(
  function* (
    tags: TagsRepository,
    { data, resource }: SaveNewAdminResourceTagsParams,
  ) {
    for (const field of resource.fields) {
      if (field.fieldType === AdminFieldTypeModel.tags) {
        yield* tags.create(data[field.name] ?? []);
      }
    }
  },
);
