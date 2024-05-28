import type { Lazy } from "../common/di/locator-types";
import type { ClientFileUploadService } from "./domain/interfaces/client-file-upload-service";

interface ClientFileUploadLocator {
  ClientFileUploadService: Lazy<ClientFileUploadService>;
}

export const clientFileUploadLocator: ClientFileUploadLocator = {
  ClientFileUploadService: async () => {
    const file = await import(
      "./data/services/client-file-upload-service-s3-impl"
    );
    return new file.ClientFileUploadServiceS3Impl();
  },
};
