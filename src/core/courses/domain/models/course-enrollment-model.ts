export interface CourseEnrollmentModelData {
  id: string;
  courseId: string;
  profileId: string;
  isFavourite: boolean;
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

  get isFavourite() {
    return this.data.isFavourite;
  }
}
