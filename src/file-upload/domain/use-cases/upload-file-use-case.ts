import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { UserDoesNotExistError } from "@/src/auth/domain/errors/auth-errors";
import { GetSessionUseCase } from "@/src/auth/domain/use-cases/get-session-use-case";
import { FileUploadsRepository } from "@/src/file-upload/domain/interfaces/file-uploads-repository";
import { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";
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
export class UploadFileUseCase extends Context.Service<UploadFileUseCase>()(
  "clubmemo/file-upload/domain/use-cases/upload-file-use-case",
  {
    make: Effect.gen(function* () {
      const getSessionUseCase = yield* GetSessionUseCase;
      const rateLimitsRepository = yield* RateLimitsRepository;
      const fileUploadsRepository = yield* FileUploadsRepository;
      const execute = Effect.fn("UploadFileUseCase.execute")(function* ({
        collection,
        field,
        contentType,
      }: UploadFileInputModel) {
        const { user } = yield* getSessionUseCase.execute();
        if (!user) return yield* Effect.fail(new UserDoesNotExistError());

        const rateLimitKey = `UploadFileUseCase/${user.id}`;
        yield* rateLimitsRepository.check(
          rateLimitKey,
          user.isAdmin ? 1000 : 100,
        );

        const picture = yield* fileUploadsRepository.create({
          collection,
          field,
          contentType,
          userId: user.id,
        });
        yield* rateLimitsRepository.increment(rateLimitKey);
        return picture;
      });
      return { execute };
    }),
  },
) {}

interface UploadFileInputModel {
  collection: FileUploadCollectionModel;
  field: FileUploadFieldModel;
  contentType: string;
}

export const UploadFileUseCaseService = UploadFileUseCase;
