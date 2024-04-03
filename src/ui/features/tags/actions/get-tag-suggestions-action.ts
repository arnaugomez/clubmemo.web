"use server";

import { locator } from "@/src/core/app/locator";
import { ActionResponse, FormActionResponse } from "@/src/ui/view-models/server-form-errors";

interface GetTagSuggestionsActionModel {
  query?: string;
}
export async function getTagSuggestionsAction({
  query,
}: GetTagSuggestionsActionModel):Promise<FormActionResponse<string[] | null>> {
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
