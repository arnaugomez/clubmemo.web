import type { PaginationFacet } from "@/src/common/data/facets/pagination-facet";
import { PaginationFacetTransformer } from "@/src/common/data/facets/pagination-facet";
import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { PaginationModel } from "@/src/common/domain/models/pagination-model";
import { practiceCardsCollection } from "@/src/practice/data/collections/practice-cards-collection";
import type { WithId } from "mongodb";
import { ObjectId } from "mongodb";
import type { NotesRepository } from "../../domain/interfaces/notes-repository";
import type { CopyNotesInputModel } from "../../domain/models/copy-notes-input-model";
import type { CreateNoteInputModel } from "../../domain/models/create-note-input-model";
import type { GetNotesInputModel } from "../../domain/models/get-notes-input-model";
import type { NoteModel } from "../../domain/models/note-model";
import type { NoteRowModel } from "../../domain/models/note-row-model";
import type { UpdateNoteInputModel } from "../../domain/models/update-note-input-model";
import type { NoteDoc } from "../collections/notes-collection";
import {
  NoteDocTransformer,
  notesCollection,
} from "../collections/notes-collection";

/**
 * Implementation of `NotesRepository` using MongoDB.
 */
export class NotesRepositoryImpl implements NotesRepository {
  private readonly notes: typeof notesCollection.type;
  private readonly practiceCards: typeof practiceCardsCollection.type;

  constructor(databaseService: DatabaseService) {
    this.notes = databaseService.collection(notesCollection);
    this.practiceCards = databaseService.collection(practiceCardsCollection);
  }
  async create(note: CreateNoteInputModel): Promise<NoteModel> {
    const newNote = {
      front: note.front,
      back: note.back,
      courseId: new ObjectId(note.courseId),
      createdAt: new Date(),
    } as WithId<NoteDoc>;
    await this.notes.insertOne(newNote);
    return new NoteDocTransformer(newNote).toDomain();
  }

  async getDetail(noteId: string): Promise<NoteModel | null> {
    const note = await this.notes.findOne({ _id: new ObjectId(noteId) });
    return note && new NoteDocTransformer(note).toDomain();
  }

  async update(note: UpdateNoteInputModel): Promise<void> {
    await this.notes.updateOne(
      { _id: new ObjectId(note.id) },
      {
        $set: {
          front: note.front,
          back: note.back,
        },
      },
    );
  }

  async delete(noteId: string): Promise<void> {
    await Promise.all([
      this.notes.deleteOne({ _id: new ObjectId(noteId) }),
      this.practiceCards.deleteMany({ noteId: new ObjectId(noteId) }),
    ]);
  }

  async get({
    courseId,
    page = 1,
    pageSize = 10,
  }: GetNotesInputModel): Promise<PaginationModel<NoteModel>> {
    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    const aggregation = this.notes.aggregate<PaginationFacet<WithId<NoteDoc>>>([
      {
        $match: {
          courseId: new ObjectId(courseId),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          results: [{ $skip: skip }, { $limit: limit }],
        },
      },
      {
        $unwind: "$metadata",
      },
    ]);

    const result = await aggregation.tryNext();
    if (!result) {
      return PaginationModel.empty();
    }
    return new PaginationFacetTransformer(result).toDomain((data) =>
      new NoteDocTransformer(data).toDomain(),
    );
  }

  async copy({
    sourceCourseId,
    targetCourseId,
  }: CopyNotesInputModel): Promise<void> {
    const sourceCourseNotes = await this.notes
      .find({ courseId: new ObjectId(sourceCourseId) })
      .toArray();
    const newNotes = sourceCourseNotes.map((note) => {
      return {
        ...note,
        _id: undefined,
        courseId: new ObjectId(targetCourseId),
      };
    });
    await this.notes.insertMany(newNotes);
  }
  async getAllRows(courseId: string): Promise<NoteRowModel[]> {
    return await this.notes
      .find(
        { courseId: new ObjectId(courseId) },
        {
          sort: { createdAt: -1 },
          limit: 1000,
          projection: { _id: false, front: true, back: true },
        },
      )
      .toArray();
  }

  async createMany(
    courseIdString: string,
    notes: NoteRowModel[],
  ): Promise<NoteModel[]> {
    const courseId = new ObjectId(courseIdString);
    const now = new Date();

    const newNotes = notes.map((note) => {
      now.setSeconds(now.getSeconds() + 1);
      const newNote: NoteDoc = {
        courseId,
        createdAt: new Date(now),
        front: note.front,
        back: note.back,
      };
      return newNote as WithId<NoteDoc>;
    });
    await this.notes.insertMany(newNotes);
    return newNotes.map((note) => new NoteDocTransformer(note).toDomain());
  }
}
