export interface EnrolledCourseListItemModelData {
  courseId: string;
  name: string;
  picture: string;
  isFavorite: boolean;
  dueCount: number;
  newCount: number;
}

export class EnrolledCourseListItemModel {
  constructor(readonly data: EnrolledCourseListItemModelData) {}

  get courseId() {
    return this.data.courseId;
  }

  get name() {
    return this.data.name;
  }

  get picture() {
    return this.data.picture;
  }

  get isFavorite() {
    return this.data.isFavorite;
  }

  get dueCount() {
    return this.data.dueCount;
  }

  get newCount() {
    return this.data.newCount;
  }

  get shouldPractice() {
    return this.data.dueCount > 0 || this.data.newCount > 0;
  }
}
