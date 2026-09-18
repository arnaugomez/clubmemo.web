import * as Schema from "effect/Schema";

import {
  default_maximum_interval,
  default_request_retention,
  generatorParameters,
} from "ts-fsrs";

export const CourseEnrollmentConfigModelDataSchema = Schema.Struct({
  enableFuzz: Schema.mutableKey(Schema.optional(Schema.Boolean)),
  maximumInterval: Schema.mutableKey(Schema.optional(Schema.Number)),
  requestRetention: Schema.mutableKey(Schema.optional(Schema.Number)),
  dailyNewCardsCount: Schema.mutableKey(Schema.optional(Schema.Number)),
  showAdvancedRatingOptions: Schema.mutableKey(Schema.optional(Schema.Boolean)),
});
export type CourseEnrollmentConfigModelData =
  typeof CourseEnrollmentConfigModelDataSchema.Type;

/**
 * The configuration of the practice of a course. Its parameters describe the
 * way the user practices a course.
 */
export class CourseEnrollmentConfigModel extends Schema.Class<CourseEnrollmentConfigModel>(
  "CourseEnrollmentConfigModel",
)({ data: CourseEnrollmentConfigModelDataSchema }) {
  constructor(data: CourseEnrollmentConfigModelData) {
    super({ data });
  }

  /**
   * Creates an empty configuration with default parameters
   * @returns An empty course enrollment config
   */
  static empty() {
    return new CourseEnrollmentConfigModel({});
  }

  get enableFuzz() {
    return this.data.enableFuzz ?? true;
  }

  get maximumInterval() {
    return this.data.maximumInterval ?? default_maximum_interval;
  }

  get requestRetention() {
    return this.data.requestRetention ?? default_request_retention;
  }

  get dailyNewCardsCount() {
    return this.data.dailyNewCardsCount ?? 10;
  }

  get showAdvancedRatingOptions() {
    return this.data.showAdvancedRatingOptions ?? true;
  }

  get cardsPerSessionCount() {
    return 10;
  }

  /**
   * Parameters for the FSRS spaced repetition algorithm
   * @returns The parameters for the FSRS spaced repetition algorithm
   * @see FSRS
   * @see CourseEnrollmentModel
   */
  get fsrsGeneratorParameters() {
    return generatorParameters({
      enable_fuzz: this.enableFuzz,
      maximum_interval: this.maximumInterval,
      request_retention: this.requestRetention,
    });
  }

  /**
   * Returns the amount of new cards left to practice today
   *
   * @param reviewsOfNewCardsCount Reviews of new cards done today
   * @returns The amount of new cards that should be practiced today
   */
  getNewCount(reviewsOfNewCardsCount: number) {
    return Math.max(0, this.dailyNewCardsCount - reviewsOfNewCardsCount);
  }
}
