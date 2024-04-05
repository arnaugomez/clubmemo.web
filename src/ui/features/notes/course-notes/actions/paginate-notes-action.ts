"use server";

import { GetNotesInputModel } from "@/src/core/notes/domain/models/get-notes-input-model";
import { ActionResponse } from "@/src/ui/models/server-form-errors";
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
