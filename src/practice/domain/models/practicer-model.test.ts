import { CourseEnrollmentModel } from "@/src/courses/domain/models/course-enrollment-model";
import { NoteModel } from "@/src/notes/domain/models/note-model";
import { describe, expect, it } from "vitest";
import { PracticeCardModel } from "./practice-card-model";
import { PracticeCardRatingModel } from "./practice-card-rating-model";
import { PracticerModel } from "./practicer-model";

const mockCard = PracticeCardModel.createNew({
  courseEnrollmentId: "1",
  note: new NoteModel({
    back: "back",
    courseId: "1",
    createdAt: new Date(),
    front: "front",
    id: "1",
  }),
  provisionalId: 0,
});

const createMockPracticer = () => {
  return new PracticerModel({
    card: mockCard,
    enrollment: new CourseEnrollmentModel({
      courseId: "1",
      id: "1",
      isFavorite: false,
      profileId: "1",
    }),
  });
};

describe("PracticerModel", () => {
  describe("getDaysToNextReview", () => {
    it("throws error if it is called before the practice method", () => {
      const practicer = createMockPracticer();
      expect(() => practicer.getDaysToNextReview()).toThrowError();
    });
    it("returns 0 when the card is new and the rating is again", () => {
      const practicer = createMockPracticer();
      practicer.practice();
      const daysCount =
        practicer.getDaysToNextReview()[PracticeCardRatingModel.again];
      expect(daysCount).toBe(0);
    });
  });

  describe("rate", () => {
    it("throws error if rating is manual", () => {
      const practicer = createMockPracticer();
      practicer.practice();
      expect(() =>
        practicer.rate(PracticeCardRatingModel.manual),
      ).toThrowError();
    });
    it("throws error if it is called before the practice method", () => {
      const practicer = createMockPracticer();
      expect(() =>
        practicer.rate(PracticeCardRatingModel.again),
      ).toThrowError();
    });
    it("returns a new instance of practice card and review log", () => {
      const practicer = createMockPracticer();
      practicer.practice();
      const result = practicer.rate(PracticeCardRatingModel.again);
      expect(result.card).toBeInstanceOf(PracticeCardModel);
      expect(result.card).not.toBe(mockCard);
      expect(result.card.fsrsCard.state).not.toBe(mockCard.fsrsCard.state);
    });
  });
});
