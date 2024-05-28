export interface CoursePracticeCountModelData {
  newCount: number;
  dueCount: number;
}

export class CoursePracticeCountModel {
  constructor(readonly data: CoursePracticeCountModelData) {}

  get newCount() {
    return this.data.newCount;
  }
  get dueCount() {
    return this.data.dueCount;
  }
  get shouldPractice() {
    return this.newCount > 0 || this.dueCount > 0;
  }
}
