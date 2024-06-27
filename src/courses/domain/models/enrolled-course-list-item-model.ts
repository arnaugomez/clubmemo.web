export interface EnrolledCourseListItemModelData {
  courseId: string;
  name: string;
  picture: string;
  isFavorite: boolean;
  dueCount: number;
  newCount: number;
}

/**
 * A list item containing the data of an enrolled course.
 */
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

  /**
   * Whether the course has any due or new cards left to practice.
   */
  get shouldPractice() {
    return this.data.dueCount > 0 || this.data.newCount > 0;
  }
}
