import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import type { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import type {
  CourseEnrollmentsRepository,
  UpdateCourseEnrollmentConfigInputModel,
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
export class EditCourseConfigUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly courseEnrollmentsRepository: CourseEnrollmentsRepository,
  ) {}

  /**
   * Changes the configuration of a course enrollment. This way, the user can
   * configure the parameters of the practice algorithm.
   *
   * @param input The input data to update the configuration of the course
   * enrollment, including the enrollment id and the new configuration
   *
   * @throws {EnrollmentDoesNotExistError} When the enrollment does not exist
   * @throws {NoPermissionError} When the user does not have permission to edit
   * the configuration
   */
  async execute(input: UpdateCourseEnrollmentConfigInputModel): Promise<void> {
    const profile = await this.getMyProfileUseCase.execute();
    if (!profile) throw new NoPermissionError();
    const enrollment = await this.courseEnrollmentsRepository.get(
      input.enrollmentId,
    );

    if (!enrollment) throw new EnrollmentDoesNotExistError();
    if (enrollment.profileId !== profile.id) throw new NoPermissionError();

    await this.courseEnrollmentsRepository.updateConfig(input);
  }
}
