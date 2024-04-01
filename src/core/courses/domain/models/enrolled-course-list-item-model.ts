export interface EnrolledCourseListItemModelData {
  courseId: string;
  name: string;
  picture: string;
  isFavorite: boolean;
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
}
