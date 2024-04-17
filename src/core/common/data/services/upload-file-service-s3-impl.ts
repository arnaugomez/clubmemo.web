import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { EnvService } from "../../domain/interfaces/env-service";
import {
  GeneratePresignedUrlInputModel,
  UploadFileService,
} from "../../domain/interfaces/upload-file-service";
import { PresignedUrlModel } from "../../domain/models/presigned-url-model";
// eslint-disable-next-line @typescript-eslint/no-namespace
declare module global {
  let s3Client: S3Client;
}

export class UploadFileServiceS3Impl implements UploadFileService {
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
        ["content-length-range", 0, 10485760], // up to 10 MB
        ["starts-with", "$Content-Type", contentType],
      ],
      Fields: {
        acl: "public-read",
        "Content-Type": contentType,
      },
      Expires: 600, // Seconds before the presigned post expires. 3600 by default.
    });

    return new PresignedUrlModel({
      url,
      fields,
    });
  }
}
