import { UserDoesNotExistError } from "@/src/auth/domain/errors/auth-errors";
import type { GetSessionUseCase } from "@/src/auth/domain/use-cases/get-session-use-case";
import type { FileUploadsRepository } from "@/src/file-upload/domain/interfaces/file-uploads-repository";
import type { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";
import type {
  FileUploadCollectionModel,
  FileUploadFieldModel,
} from "../models/file-upload-field-model";

/**
 * Uploads the files of a course, such as the picture, before making changes to
 * the course.
 *
 * @param input The input data to upload the files of the course, including the
 * file type and the course id
 * @returns Relevant data to upload the files of the course, such as a presigned
 * URL to upload the file on the client side
 */
export class UploadFileUseCase {
  constructor(
    private readonly getSessionUseCase: GetSessionUseCase,
    private readonly rateLimitsRepository: RateLimitsRepository,
    private readonly fileUploadsRepository: FileUploadsRepository,
  ) {}

  /**
   * Uploads the files of a course, such as the picture, before making changes to
   * the course.
   *
   * @param input The input data to upload the files of the course, including the
   * file type and the course id
   * @returns Relevant data to upload the files of the course, such as a presigned
   * URL to upload the file on the client side
   */
  async execute({ collection, field, contentType }: UploadFileInputModel) {
    const { user } = await this.getSessionUseCase.execute();
    if (!user) throw new UserDoesNotExistError();

    const rateLimitKey = `UploadFileUseCase/${user.id}`;
    await this.rateLimitsRepository.check(
      rateLimitKey,
      user.isAdmin ? 1000 : 100,
    );

    const picture = await this.fileUploadsRepository.create({
      collection,
      field,
      contentType,
      userId: user.id,
    });
    await this.rateLimitsRepository.increment(rateLimitKey);
    return picture;
  }
}

interface UploadFileInputModel {
  collection: FileUploadCollectionModel;
  field: FileUploadFieldModel;
  contentType: string;
}
