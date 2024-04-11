import { MongoService } from "@/src/core/app/domain/interfaces/mongo-service";
import {
  NoteDoc,
  NoteDocTransformer,
  notesCollection,
} from "@/src/core/notes/data/collections/notes-collection";
import { ObjectId, WithId } from "mongodb";
import {
  GetDueInput,
  GetUnpracticedInput,
  PracticeCardsRepository,
} from "../../domain/interfaces/practice-cards-repository";
import { PracticeCardModel } from "../../domain/models/practice-card-model";
import {
  PracticeCardAggregationDoc,
  PracticeCardAggregationDocTransformer,
} from "../collections/practice-card-aggregation";
import { practiceCardsCollection } from "../collections/practice-cards-collection";

export class PracticeCardsRepositoryImpl implements PracticeCardsRepository {
  private readonly practiceCards: typeof practiceCardsCollection.type;
  private readonly notes: typeof notesCollection.type;

  constructor(mongoService: MongoService) {
    this.practiceCards = mongoService.collection(practiceCardsCollection);
    this.notes = mongoService.collection(notesCollection);
  }

  async create(input: PracticeCardModel): Promise<PracticeCardModel> {
    const result = await this.practiceCards.insertOne({
      courseEnrollmentId: new ObjectId(input.data.courseEnrollmentId),
      noteId: new ObjectId(input.note.id),
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
    input.data.id = result.insertedId.toHexString();
    return new PracticeCardModel(input.data);
  }

  async getUnpracticed(
    input: GetUnpracticedInput,
  ): Promise<PracticeCardModel[]> {
    const cursor = this.notes.aggregate<WithId<NoteDoc>>([
      {
        $match: {
          courseId: new ObjectId(input.courseId),
        },
      },
      {
        $lookup: {
          from: practiceCardsCollection.name,
          localField: "_id",
          foreignField: "noteId",
          as: "practiceCard",
        },
      },
      {
        $match: {
          practiceCard: [],
        },
      },
      {
        $limit: input.limit,
      },
    ]);
    const results = await cursor.toArray();
    return results.map((e) => {
      return PracticeCardModel.createNew({
        courseEnrollmentId: input.courseEnrollmentId,
        note: new NoteDocTransformer(e).toDomain(),
      });
    });
  }

  async getDue(input: GetDueInput): Promise<PracticeCardModel[]> {
    const cursor = this.practiceCards.aggregate<PracticeCardAggregationDoc>([
      {
        $match: {
          courseEnrollmentId: new ObjectId(input.courseEnrollmentId),
          due: { $lte: new Date() },
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

  async getDueCount(courseEnrollmentId: number): Promise<number> {
    const cursor = this.practiceCards.aggregate<{ count: number }>([
      {
        $match: {
          courseEnrollmentId: new ObjectId(courseEnrollmentId),
          due: { $lte: new Date() },
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
