import * as Schema from "effect/Schema";

export const CoursePracticeCountModelDataSchema = Schema.Struct({
  newCount: Schema.mutableKey(Schema.Number),
  dueCount: Schema.mutableKey(Schema.Number),
});
export type CoursePracticeCountModelData =
  typeof CoursePracticeCountModelDataSchema.Type;

/**
 * The amount of new and due cards in a course
 *
 * New cards are those that the learner has not practiced even once, so they need
 * to be learned for the first time.
 *
 * Due cards are those that the learner has already practiced and that need to be
 * practiced again because their practice date has been reached.
 */
export class CoursePracticeCountModel extends Schema.Class<CoursePracticeCountModel>(
  "CoursePracticeCountModel",
)({ data: CoursePracticeCountModelDataSchema }) {
  constructor(data: CoursePracticeCountModelData) {
    super({ data });
  }

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
