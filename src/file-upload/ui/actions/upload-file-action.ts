"use server";

import { ActionErrorHandler } from "@/src/common/ui/actions/action-error-handler";
import type { FormActionResponse } from "@/src/common/ui/models/server-form-errors";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import type { CreateFileUploadOutputModel } from "@/src/file-upload/domain/interfaces/file-uploads-repository";
import { locator_fileUpload_UploadFileUseCase } from "../../locators/locator_upload-file-use-case";
import {
  UploadFileActionSchema,
  type UploadFileActionModel,
} from "../schemas/upload-file-action-schema";

export async function uploadFileAction(
  input: UploadFileActionModel,
): Promise<FormActionResponse<CreateFileUploadOutputModel | null>> {
  try {
    const parsed = UploadFileActionSchema.parse(input);

    const useCase = locator_fileUpload_UploadFileUseCase();
    const file = await useCase.execute(parsed);

    return ActionResponse.formSuccess(file);
  } catch (e) {
    return ActionErrorHandler.handle(e);
  }
}
