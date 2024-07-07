import { describe } from "node:test";
import { expect, it } from "vitest";
import {
  CourseEnrollmentConfigModel,
  type CourseEnrollmentConfigModelData,
} from "./course-enrollment-config-model";

describe("CourseEnrollmentConfigModel", () => {
  const data: CourseEnrollmentConfigModelData = {
    enableFuzz: true,
    maximumInterval: 4,
    requestRetention: 8,
    dailyNewCardsCount: 234,
    showAdvancedRatingOptions: false,
  };
  const model = new CourseEnrollmentConfigModel(data);
  const emptyModel = CourseEnrollmentConfigModel.empty();

  it("getter values match constructor data", () => {
    expect(model.enableFuzz).toBe(data.enableFuzz);
    expect(model.maximumInterval).toBe(data.maximumInterval);
    expect(model.requestRetention).toBe(data.requestRetention);
    expect(model.dailyNewCardsCount).toBe(data.dailyNewCardsCount);
    expect(model.showAdvancedRatingOptions).toBe(
      data.showAdvancedRatingOptions,
    );
  });

  it("cardsPerSessionCount is always 10 (it will be configurable in future versions of the app)", () => {
    expect(model.cardsPerSessionCount).toBe(10);
    expect(emptyModel.cardsPerSessionCount).toBe(10);
  });

  it("empty object has default values of params", () => {
    expect(emptyModel.enableFuzz).toBe(true);
    expect(emptyModel.maximumInterval).toBe(36500);
    expect(emptyModel.requestRetention).toBe(0.9);
    expect(emptyModel.dailyNewCardsCount).toBe(10);
    expect(emptyModel.showAdvancedRatingOptions).toBe(true);
  });

  it("getNewCount returns the number of cards left to practice", () => {
    expect(model.getNewCount(0)).toBe(data.dailyNewCardsCount);
    expect(model.getNewCount(100)).toBe(134);
    expect(model.getNewCount(234)).toBe(0);
    expect(model.getNewCount(600)).toBe(0);

    expect(emptyModel.getNewCount(0)).toBe(10);
    expect(emptyModel.getNewCount(10)).toBe(0);
    expect(emptyModel.getNewCount(100)).toBe(0);
  });
});
