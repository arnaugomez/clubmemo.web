"use server";

import { InvalidFileFormatError } from "@/src/common/domain/models/app-errors";
import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { notesLocator } from "@/src/notes/notes-locator";
import { ImportNotesActionSchema } from "../schemas/import-notes-action-schema";

export async function importNotesAction(formData: FormData) {
  try {
    if (!(formData instanceof FormData))
      throw new Error("formData is not an instance of FormData.");

    const parsed = ImportNotesActionSchema.parse({
      file: formData.get("file"),
      courseId: formData.get("courseId"),
      importType: formData.get("importType"),
    });

    const importNotesUseCase = await notesLocator.ImportNotesUseCase();
    const result = await importNotesUseCase.execute({
      courseId: parsed.courseId,
      file: parsed.file,
      importType: parsed.importType,
    });

    return ActionResponse.formSuccess(result.map((e) => e.data));
  } catch (e) {
    if (e instanceof InvalidFileFormatError) {
      return ActionResponse.formError("file", {
        type: "invalidFileFormat",
        message: "Formato de archivo inválido",
      });
    }
    return ActionErrorHandler.handle(e);
  }
}
