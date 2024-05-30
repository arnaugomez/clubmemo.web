import { FSRS } from "ts-fsrs";
import type { CourseEnrollmentConfigModelData } from "./course-enrollment-config-model";
import { CourseEnrollmentConfigModel } from "./course-enrollment-config-model";

export interface CourseEnrollmentModelData {
  id: string;
  courseId: string;
  profileId: string;
  isFavorite: boolean;
  config?: CourseEnrollmentConfigModelData;
}

export class CourseEnrollmentModel {
  constructor(readonly data: CourseEnrollmentModelData) {}

  get id() {
    return this.data.id;
  }

  get courseId() {
    return this.data.courseId;
  }

  get profileId() {
    return this.data.profileId;
  }

  get isFavorite() {
    return this.data.isFavorite;
  }

  get config() {
    if (!this.data.config) {
      return CourseEnrollmentConfigModel.empty();
    }
    return new CourseEnrollmentConfigModel(this.data.config);
  }

  get fsrs() {
    return new FSRS(this.config.fsrsGeneratorParameters);
  }
}
