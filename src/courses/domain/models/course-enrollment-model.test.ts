import { FSRS } from "ts-fsrs";
import { describe, expect, it } from "vitest";
import type { CourseEnrollmentModelData } from "./course-enrollment-model";
import { CourseEnrollmentModel } from "./course-enrollment-model";

describe("CourseEnrollmentModel", () => {
  const data: CourseEnrollmentModelData = {
    id: "id",
    courseId: "courseId",
    profileId: "profileId",
    isFavorite: true,
  };
  const model = new CourseEnrollmentModel(data);

  it("properties match data", () => {
    expect(model.id).toBe(data.id);
    expect(model.courseId).toBe(data.courseId);
    expect(model.profileId).toBe(data.profileId);
  });

  it("fsrs returns an instance of the FSRS spaced repetition algorithm", () => {
    expect(model.fsrs).toBeInstanceOf(FSRS);
  });

  it("config returns an empty config model if config data is not provided", () => {
    const config = model.config;
    expect(config.enableFuzz).toBe(true);
    expect(config.maximumInterval).toBe(36500);
    expect(config.requestRetention).toBe(0.9);
    expect(config.dailyNewCardsCount).toBe(10);
    expect(config.showAdvancedRatingOptions).toBe(true);
    expect(config.cardsPerSessionCount).toBe(10);
  });

  it("config returns a config model if config data was provided", () => {
    const dataWithConfig: CourseEnrollmentModelData = {
      ...data,
      config: {
        enableFuzz: false,
        maximumInterval: 4,
        requestRetention: 0.1,
        dailyNewCardsCount: 234,
        showAdvancedRatingOptions: false,
      },
    };
    const model = new CourseEnrollmentModel(dataWithConfig);
    const config = model.config;

    expect(config.enableFuzz).toBe(false);
    expect(config.maximumInterval).toBe(4);
    expect(config.requestRetention).toBe(0.1);
    expect(config.dailyNewCardsCount).toBe(234);
    expect(config.showAdvancedRatingOptions).toBe(false);
    expect(config.cardsPerSessionCount).toBe(10);
  });
});
