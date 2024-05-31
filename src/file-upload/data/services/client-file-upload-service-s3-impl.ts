import { FileUploadNotSuccessfulError } from "../../domain/errors/file-upload-errors";
import type {
  ClientFileUploadService,
  UploadPresignedUrlInputModel,
} from "../../domain/interfaces/client-file-upload-service";

/**
 * Implementation of `ClientFileUploadService` that uploads files to an S3 bucket
 */
export class ClientFileUploadServiceS3Impl implements ClientFileUploadService {
  async uploadPresignedUrl({
    file,
    presignedUrl: { url, fields },
  }: UploadPresignedUrlInputModel) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(fields)) {
      formData.append(key, value);
    }
    formData.append("file", file);

    const uploadResponse = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new FileUploadNotSuccessfulError();
    }
  }
}
