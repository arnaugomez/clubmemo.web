import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import type { ExternalServiceError } from "@/src/common/effect/errors";
import type { PracticeCardModel } from "../models/practice-card-model";

/**
 * Repository for practice cards.
 *
 * Practice cards keep track of the learner's progress in memorizing a certain
 * note. The card is a relationship between a note and a course enrollment. It
 * contains the data of the learner's progress, such as the next time the
 * learner should practice the note, the number of previous practices, etc.
 */
export interface PracticeCardsRepository {
  /**
   * Creates a new practice card for a certain note and course enrollment
   *
   * @param input Data of the new card
   * @returns The created card
   */
  create(
    input: PracticeCardModel,
  ): Effect.Effect<PracticeCardModel, ExternalServiceError>;

  /**
   * Updates the data of a practice card once it has been practiced and its
   * values have changed
   *
   * @param input Updated data of the card
   */
  update(input: PracticeCardModel): Effect.Effect<void, ExternalServiceError>;

  /**
   * Gets a list of new cards. New cards are those that the learner has not
   * practiced even once, so they need to be learned for the first time.
   *
   * @param input The query to get the cards, including the course
   * id and the course enrollment id
   * @returns A list of new cards
   */
  getNew(
    input: GetNewInput,
  ): Effect.Effect<PracticeCardModel[], ExternalServiceError>;

  /**
   * Gets a list of due cards. Due cards are those that the learner has already
   * practiced and that need to be practiced again because their practice date
   * has been reached.
   *
   * @param input The query to get the due cards, including the course id and
   * the course enrollment id
   * @returns A list of due cards
   */
  getDue(
    input: GetDueInput,
  ): Effect.Effect<PracticeCardModel[], ExternalServiceError>;

  /**
   * Gets the total count of new cards. New cards are those that the learner has
   * not practiced even once, so they need to be learned for the first time.
   *
   * @param input The query to get the new cards, including the course id and
   * the course enrollment id
   * @returns The total count of new cards
   */
  getNewCount(
    input: GetNewCountInput,
  ): Effect.Effect<number, ExternalServiceError>;

  /**
   * Gets the total count of due cards. Due cards are those that the learner has
   * already practiced and that need to be practiced again because their
   * practice date has been reached.
   *
   * @param input The query to get the due cards, including the course id and
   * the course enrollment id
   * @returns The total count of due cards
   */
  getDueCount(
    courseEnrollmentId: string,
  ): Effect.Effect<number, ExternalServiceError>;
}

export interface GetNewInput {
  courseId: string;
  courseEnrollmentId: string;
  limit: number;
}
export interface GetNewCountInput {
  courseId: string;
  courseEnrollmentId: string;
}

export interface GetDueInput {
  courseEnrollmentId: string;
  limit: number;
}

export const PracticeCardsRepository = Context.Service<PracticeCardsRepository>(
  "clubmemo/practice/domain/interfaces/practice-cards-repository/PracticeCardsRepository",
);
