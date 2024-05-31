import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import type { EnvService } from "../../../common/domain/interfaces/env-service";
import type {
  FileUploadService,
  GeneratePresignedUrlInputModel,
} from "../../domain/interfaces/file-upload-service";
import type { PresignedUrlModel } from "../../domain/models/presigned-url-model";
// eslint-disable-next-line @typescript-eslint/no-namespace
declare module global {
  let s3Client: S3Client;
}

/**
 * Implementation of `FileUploadService` that uses the AWS S3 SDK
 */
export class FileUploadServiceS3Impl implements FileUploadService {
  private readonly client: S3Client;
  constructor(private readonly envService: EnvService) {
    global.s3Client ??= new S3Client({ region: envService.awsRegion });
    this.client = global.s3Client;
  }

  async generatePresignedUrl(
    input: GeneratePresignedUrlInputModel,
  ): Promise<PresignedUrlModel> {
    const { key, contentType } = input;
    const { url, fields } = await createPresignedPost(this.client, {
      Bucket: this.envService.awsBucketName,
      Key: key,
      Conditions: [
        ["content-length-range", 0, 5 * 1024 * 1024], // up to 5 MB
        ["starts-with", "$Content-Type", contentType],
      ],
      Fields: {
        acl: "public-read",
        "Content-Type": contentType,
      },
      Expires: 600, // Seconds before the presigned post expires. 3600 by default.
    });

    return { url, fields };
  }

  async deleteFile(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.envService.awsBucketName,
        Key: key,
      }),
    );
  }
}
