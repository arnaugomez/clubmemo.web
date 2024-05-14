"use server";

import { locator } from "@/src/common/locator";
import type { FormActionResponse } from "@/src/common/ui/models/server-form-errors";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";

interface GetTagSuggestionsActionModel {
  query?: string;
}
export async function getTagSuggestionsAction({
  query,
}: GetTagSuggestionsActionModel): Promise<FormActionResponse<string[] | null>> {
  try {
    const repository = await locator.TagsRepository();
    const results = await repository.getSuggestions(query);
    return ActionResponse.formSuccess(results);
  } catch (e) {
    // TODO: log error report
    console.error(e);
    return ActionResponse.formGlobalError("general");
  }
}
