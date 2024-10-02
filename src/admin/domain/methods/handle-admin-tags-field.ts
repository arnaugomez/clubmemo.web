import { locator_tags_TagsRepository } from "@/src/tags/locators/locator_tags-repository";
import type { AdminResourceData } from "../models/admin-resource-data";
import type { AdminResourceModel } from "../models/admin-resource-model";
import { AdminFieldTypeModel } from "../models/admin-resource-model";

interface Props {
  data: AdminResourceData;
  resource: AdminResourceModel;
}
export async function saveNewAdminResourceTags({ data, resource }: Props) {
  for (const field of resource.fields) {
    if (field.fieldType === AdminFieldTypeModel.tags) {
      await locator_tags_TagsRepository().create(data[field.name] ?? []);
    }
  }
}
