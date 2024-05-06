"use server";

import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { GetNotesInputModel } from "@/src/notes/domain/models/get-notes-input-model";
import { fetchCourseNotes } from "../fetch/fetch-course-notes";

export async function paginateNotesAction(input: GetNotesInputModel) {
  try {
    const response = await fetchCourseNotes(input);
    return ActionResponse.formSuccess(response.toData((e) => e.data));
  } catch (e) {
    // TODO: log error report
    console.error(e);
    return ActionResponse.formGlobalError("general");
  }
}
