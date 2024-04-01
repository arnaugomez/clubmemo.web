export interface CourseEnrollmentModelData {
  id: string;
  courseId: string;
  profileId: string;
  isFavorite: boolean;
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
}
