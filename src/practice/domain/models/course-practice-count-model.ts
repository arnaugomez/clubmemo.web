export interface CoursePracticeCountModelData {
  newCount: number;
  dueCount: number;
}

/**
 * The amount of new and due cards in a course
 *
 * New cards are those that the learner has not practiced even once, so they need
 * to be learned for the first time.
 *
 * Due cards are those that the learner has already practiced and that need to be
 * practiced again because their practice date has been reached.
 */
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
