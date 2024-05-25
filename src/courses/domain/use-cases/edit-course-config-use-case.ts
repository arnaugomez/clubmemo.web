import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import type { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import type {
  CourseEnrollmentsRepository,
  UpdateCourseEnrollmentConfigInputModel,
} from "../interfaces/course-enrollments-repository";
import { EnrollmentDoesNotExistError } from "../models/enrollment-errors";

export class EditCourseConfigUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly courseEnrollmentsRepository: CourseEnrollmentsRepository,
  ) {}
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
