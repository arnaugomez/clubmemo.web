export interface KeepLearningModelData {
  courseId: string;
  name: string;
  description: string;
  picture: string;
  tags: string[];
  dueCount: number;
  newCount: number;
}

export class KeepLearningModel {
  constructor(readonly data: KeepLearningModelData) {}

  get courseId() {
    return this.data.courseId;
  }

  get name() {
    return this.data.name;
  }
  get description() {
    return this.data.description;
  }

  get picture() {
    return this.data.picture;
  }

  get tags() {
    return this.data.tags;
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
