import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import type { DateTimeService } from "@/src/common/domain/interfaces/date-time-service";
import type { NoteDoc } from "@/src/notes/data/collections/notes-collection";
import {
  NoteDocTransformer,
  notesCollection,
} from "@/src/notes/data/collections/notes-collection";
import type { WithId } from "mongodb";
import { ObjectId } from "mongodb";
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

  async create(input: PracticeCardModel): Promise<PracticeCardModel> {
    const result = await this.practiceCards.insertOne({
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
    });
    input.data.id = result.insertedId.toString();
    return new PracticeCardModel(input.data);
  }
  async update(input: PracticeCardModel): Promise<void> {
    await this.practiceCards.updateOne(
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
    );
  }

  async getNew(input: GetNewInput): Promise<PracticeCardModel[]> {
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
    const results = await cursor.toArray();
    return results.map((e, i) => {
      return PracticeCardModel.createNew({
        courseEnrollmentId: input.courseEnrollmentId,
        note: new NoteDocTransformer(e).toDomain(),
        provisionalId: i,
      });
    });
  }

  async getNewCount(input: GetNewInput): Promise<number> {
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
    const result = await cursor.next();
    return result?.count ?? 0;
  }

  async getDue(input: GetDueInput): Promise<PracticeCardModel[]> {
    const cursor = this.practiceCards.aggregate<PracticeCardAggregationDoc>([
      {
        $match: {
          courseEnrollmentId: new ObjectId(input.courseEnrollmentId),
          due: { $lte: this.dateTimeService.getStartOfTomorrow() },
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
    const result = await cursor.toArray();
    return result.map((e) =>
      new PracticeCardAggregationDocTransformer(e).toDomain(),
    );
  }

  async getDueCount(courseEnrollmentId: string): Promise<number> {
    const cursor = this.practiceCards.aggregate<{ count: number }>([
      {
        $match: {
          courseEnrollmentId: new ObjectId(courseEnrollmentId),
          due: { $lte: this.dateTimeService.getStartOfTomorrow() },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    const result = await cursor.next();
    return result?.count ?? 0;
  }
}
