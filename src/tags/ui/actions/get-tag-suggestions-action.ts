"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import type { FormActionResponse } from "@/src/common/ui/models/server-form-errors";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { locator_tags_TagsRepository } from "../../locators/locator_tags-repository";
import type { GetTagSuggestionsActionModel } from "../schemas/get-tag-suggestions-action-schema";
import { GetTagSuggestionsActionSchema } from "../schemas/get-tag-suggestions-action-schema";

export async function getTagSuggestionsAction(
  input: GetTagSuggestionsActionModel,
): Promise<FormActionResponse<string[] | null>> {
  try {
    const { query } = GetTagSuggestionsActionSchema.parse(input);

    const repository = locator_tags_TagsRepository();
    const results = await repository.getSuggestions(query);

    return ActionResponse.formSuccess(results);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
