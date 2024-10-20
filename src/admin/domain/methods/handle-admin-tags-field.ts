import { locator_tags_TagsRepository } from "@/src/tags/locators/locator_tags-repository";
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
export async function saveNewAdminResourceTags({
  data,
  resource,
}: SaveNewAdminResourceTagsParams) {
  for (const field of resource.fields) {
    if (field.fieldType === AdminFieldTypeModel.tags) {
      await locator_tags_TagsRepository().create(data[field.name] ?? []);
    }
  }
}
