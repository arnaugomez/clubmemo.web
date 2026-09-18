import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import {
  CourseEnrollmentsRepository,
  type UpdateCourseEnrollmentConfigInputModel,
} from "../interfaces/course-enrollments-repository";
import { EnrollmentDoesNotExistError } from "../models/enrollment-errors";

/**
 * Changes the configuration of a course enrollment. This way, the user can
 * configure the parameters of the practice algorithm.
 *
 * @param input The input data to update the configuration of the course
 * enrollment, including the enrollment id and the new configuration
 *
 * @throws {EnrollmentDoesNotExistError} When the enrollment does not exist
 * @throws {NoPermissionError} When the configuration does not belong to the
 * current user's profile.
 */
export class EditCourseConfigUseCase extends Context.Service<EditCourseConfigUseCase>()(
  "clubmemo/courses/domain/use-cases/edit-course-config-use-case",
  {
    make: Effect.gen(function* () {
      const getMyProfileUseCase = yield* GetMyProfileUseCase;
      const courseEnrollmentsRepository = yield* CourseEnrollmentsRepository;
      const execute = Effect.fn("EditCourseConfigUseCase.execute")(function* (
        input: UpdateCourseEnrollmentConfigInputModel,
      ) {
        const profile = yield* getMyProfileUseCase.execute();
        if (!profile) return yield* Effect.fail(new NoPermissionError());
        const enrollment = yield* courseEnrollmentsRepository.get(
          input.enrollmentId,
        );

        if (!enrollment)
          return yield* Effect.fail(new EnrollmentDoesNotExistError());
        if (enrollment.profileId !== profile.id)
          return yield* Effect.fail(new NoPermissionError());

        yield* courseEnrollmentsRepository.updateConfig(input);
      });
      return { execute };
    }),
  },
) {}

export const EditCourseConfigUseCaseService = EditCourseConfigUseCase;
