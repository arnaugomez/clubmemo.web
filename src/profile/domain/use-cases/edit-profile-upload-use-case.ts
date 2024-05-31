import type { FileUploadsRepository } from "@/src/file-upload/domain/interfaces/file-uploads-repository";
import type { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";
import { ProfileDoesNotExistError } from "../errors/profile-errors";
import type { GetMyProfileUseCase } from "./get-my-profile-use-case";

/**
 * Generates presigned urls to upload a new profile picture and/or background picture for the profile, before
 * the profile is updated
 *
 * @param input The input data to upload a new profile picture and/or background. It
 * contains the content type of the pictures.
 * @returns The presigned URL to upload the picture to the external storage service
 */
export class EditProfileUploadUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly rateLimitsRepository: RateLimitsRepository,
    private readonly fileUploadsRepository: FileUploadsRepository,
  ) {}

  /**
   * Generates presigned urls to upload a new profile picture and/or background
   * picture for the profile, before the profile is updated
   * @param input The input data to upload a new profile picture and/or
   * background. It contains the content type of the pictures.
   * @returns The presigned URL to upload the picture to the external storage
   * service
   */
  async execute({
    uploadPicture,
    pictureContentType,
    uploadBackgroundPicture,
    backgroundPictureContentType,
  }: EditProfileUploadInputModel) {
    const profile = await this.getMyProfileUseCase.execute();
    if (!profile) throw new ProfileDoesNotExistError();

    const rateLimitKey = `EditProfileUploadUseCase/${profile.id}`;
    if (uploadPicture || uploadBackgroundPicture) {
      await this.rateLimitsRepository.check(rateLimitKey, 40);
      await this.rateLimitsRepository.increment(rateLimitKey);
    }

    return await Promise.all([
      uploadPicture
        ? this.fileUploadsRepository.create({
            keyPrefix: `profile/picture/${profile.id}`,
            fileName: "picture",
            contentType: pictureContentType,
          })
        : undefined,
      uploadBackgroundPicture
        ? this.fileUploadsRepository.create({
            keyPrefix: `profile/background-picture/${profile.id}`,
            fileName: "background-picture",
            contentType: backgroundPictureContentType,
          })
        : undefined,
    ]);
  }
}

interface EditProfileUploadInputModel {
  uploadPicture: boolean;
  pictureContentType: string;
  uploadBackgroundPicture: boolean;
  backgroundPictureContentType: string;
}
