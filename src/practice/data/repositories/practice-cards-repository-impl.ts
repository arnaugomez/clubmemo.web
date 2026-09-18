import * as Effect from "effect/Effect";
import type { WithId } from "mongodb";
import { ObjectId } from "mongodb";
import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import type { DateTimeService } from "@/src/common/domain/interfaces/date-time-service";
import { ExternalServiceError } from "@/src/common/effect/errors";
import type { NoteDoc } from "@/src/notes/data/collections/notes-collection";
import {
  NoteDocTransformer,
  notesCollection,
} from "@/src/notes/data/collections/notes-collection";
import type {
  GetDueInput,
  GetNewInput,
  PracticeCardsRepository,
} from "../../domain/interfaces/practice-cards-repository";
import { PracticeCardModel } from "../../domain/models/practice-card-model";
import type { PracticeCardAggregationDoc } from "../collections/practice-card-aggregation";
import { PracticeCardAggregationDocTransformer } from "../collections/practice-card-aggregation";
import { practiceCardsCollection } from "../collections/practice-cards-collection";

/**
 * Implementation of `PracticeCardsRepository` using the MongoDB database.
 */
export class PracticeCardsRepositoryImpl implements PracticeCardsRepository {
  private readonly practiceCards: typeof practiceCardsCollection.type;
  private readonly notes: typeof notesCollection.type;

  constructor(
    databaseService: DatabaseService,
    private readonly dateTimeService: DateTimeService,
  ) {
    this.practiceCards = databaseService.collection(practiceCardsCollection);
    this.notes = databaseService.collection(notesCollection);
  }

  create = Effect.fn("PracticeCardsRepositoryImpl.create")(function* (
    this: PracticeCardsRepositoryImpl,
    input: PracticeCardModel,
  ) {
    const result = yield* Effect.tryPromise({
      try: () =>
        this.practiceCards.insertOne({
          courseEnrollmentId: new ObjectId(input.data.courseEnrollmentId),
          noteId: new ObjectId(input.note.data.id),
          due: input.data.due,
          stability: input.data.stability,
          difficulty: input.data.difficulty,
          elapsedDays: input.data.elapsedDays,
          scheduledDays: input.data.scheduledDays,
          reps: input.data.reps,
          lapses: input.data.lapses,
          state: input.data.state,
          lastReview: input.data.lastReview,
        }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "PracticeCardsRepositoryImpl.create",
          cause,
        }),
    });
    input.data.id = result.insertedId.toString();
    return new PracticeCardModel(input.data);
  }).bind(this);
  update = Effect.fn("PracticeCardsRepositoryImpl.update")(function* (
    this: PracticeCardsRepositoryImpl,
    input: PracticeCardModel,
  ) {
    yield* Effect.tryPromise({
      try: () =>
        this.practiceCards.updateOne(
          {
            _id: new ObjectId(input.data.id),
          },
          {
            $set: {
              due: input.data.due,
              stability: input.data.stability,
              difficulty: input.data.difficulty,
              elapsedDays: input.data.elapsedDays,
              scheduledDays: input.data.scheduledDays,
              reps: input.data.reps,
              lapses: input.data.lapses,
              state: input.data.state,
              lastReview: input.data.lastReview,
            },
          },
        ),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "PracticeCardsRepositoryImpl.update",
          cause,
        }),
    });
  }).bind(this);

  getNew = Effect.fn("PracticeCardsRepositoryImpl.getNew")(function* (
    this: PracticeCardsRepositoryImpl,
    input: GetNewInput,
  ) {
    const cursor = this.notes.aggregate<WithId<NoteDoc>>([
      {
        $match: {
          courseId: new ObjectId(input.courseId),
        },
      },
      {
        $lookup: {
          from: practiceCardsCollection.name,
          let: {
            noteId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$noteId", "$$noteId"],
                },
                courseEnrollmentId: new ObjectId(input.courseEnrollmentId),
              },
            },
            {
              $limit: 1,
            },
          ],
          as: "practiceCards",
        },
      },
      {
        $match: {
          practiceCards: { $size: 0 },
        },
      },
      {
        $limit: input.limit,
      },
    ]);
    const results = yield* Effect.tryPromise({
      try: () => cursor.toArray(),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "PracticeCardsRepositoryImpl.getNew",
          cause,
        }),
    });
    return results.map((e, i) => {
      return PracticeCardModel.createNew({
        courseEnrollmentId: input.courseEnrollmentId,
        note: new NoteDocTransformer(e).toDomain(),
        provisionalId: i,
      });
    });
  }).bind(this);

  getNewCount = Effect.fn("PracticeCardsRepositoryImpl.getNewCount")(function* (
    this: PracticeCardsRepositoryImpl,
    input: GetNewInput,
  ) {
    const cursor = this.notes.aggregate<{ count: number }>([
      {
        $match: {
          courseId: new ObjectId(input.courseId),
        },
      },
      {
        $lookup: {
          from: practiceCardsCollection.name,
          let: {
            noteId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$noteId", "$$noteId"],
                },
                courseEnrollmentId: new ObjectId(input.courseEnrollmentId),
              },
            },
            {
              $limit: 1,
            },
          ],
          as: "practiceCards",
        },
      },
      {
        $match: {
          practiceCards: { $size: 0 },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    const result = yield* Effect.tryPromise({
      try: () => cursor.next(),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "PracticeCardsRepositoryImpl.getNewCount",
          cause,
        }),
    });
    return result?.count ?? 0;
  }).bind(this);

  getDue = Effect.fn("PracticeCardsRepositoryImpl.getDue")(function* (
    this: PracticeCardsRepositoryImpl,
    input: GetDueInput,
  ) {
    const getStartOfTomorrow = yield* this.dateTimeService.getStartOfTomorrow();
    const cursor = this.practiceCards.aggregate<PracticeCardAggregationDoc>([
      {
        $match: {
          courseEnrollmentId: new ObjectId(input.courseEnrollmentId),
          due: { $lte: getStartOfTomorrow },
        },
      },
      { $limit: input.limit },
      {
        $lookup: {
          from: notesCollection.name,
          localField: "noteId",
          foreignField: "_id",
          as: "note",
        },
      },
      {
        $unwind: "$note",
      },
    ]);
    const result = yield* Effect.tryPromise({
      try: () => cursor.toArray(),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "PracticeCardsRepositoryImpl.getDue",
          cause,
        }),
    });
    return result.map((e) =>
      new PracticeCardAggregationDocTransformer(e).toDomain(),
    );
  }).bind(this);

  getDueCount = Effect.fn("PracticeCardsRepositoryImpl.getDueCount")(function* (
    this: PracticeCardsRepositoryImpl,
    courseEnrollmentId: string,
  ) {
    const getStartOfTomorrow = yield* this.dateTimeService.getStartOfTomorrow();
    const cursor = this.practiceCards.aggregate<{ count: number }>([
      {
        $match: {
          courseEnrollmentId: new ObjectId(courseEnrollmentId),
          due: { $lte: getStartOfTomorrow },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    const result = yield* Effect.tryPromise({
      try: () => cursor.next(),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "PracticeCardsRepositoryImpl.getDueCount",
          cause,
        }),
    });
    return result?.count ?? 0;
  }).bind(this);
}
