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
  showAdvancedRatingOptions?: boolean;
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

  get fsrsGeneratorParameters() {
    return generatorParameters({
      enable_fuzz: this.enableFuzz,
      maximum_interval: this.maximumInterval,
      request_retention: this.requestRetention,
    });
  }
}