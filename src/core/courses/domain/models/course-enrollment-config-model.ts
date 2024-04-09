import {
  default_maximum_interval,
  default_request_retention,
  generatorParameters,
} from "ts-fsrs";

export interface CourseEnrollmentConfigModelData {
  enableFuzz?: boolean;
  maximumInterval?: number;
  requestRetention?: number;
  dailyNewCardsCount?: number;
  simplifyRatingOptions?: boolean;
}

export class CourseEnrollmentConfigModel {
  constructor(readonly data: CourseEnrollmentConfigModelData) {}

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
    return this.data.maximumInterval ?? default_request_retention;
  }

  get dailyNewCardsCount() {
    return this.data.dailyNewCardsCount ?? 10;
  }

  get simplifyRatingOptions() {
    return this.data.simplifyRatingOptions ?? false;
  }

  get fsrsGeneratorParameters() {
    return generatorParameters({
      enable_fuzz: this.enableFuzz,
      maximum_interval: this.maximumInterval,
      request_retention: this.requestRetention,
    });
  }
}
