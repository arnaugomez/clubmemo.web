import {
  PaginationFacet,
  PaginationFacetTransformer,
} from "@/src/core/app/data/services/facets/pagination-facet";
import { MongoService } from "@/src/core/app/domain/interfaces/mongo-service";
import { PaginationModel } from "@/src/core/app/domain/models/pagination-model";
import { ObjectId, WithId } from "mongodb";
import { NotesRepository } from "../../domain/interfaces/notes-repository";
import { CreateNoteInputModel } from "../../domain/models/create-note-input-model";
import { GetNotesInputModel } from "../../domain/models/get-notes-input-model";
import { NoteModel } from "../../domain/models/note-model";
import { UpdateNoteInputModel } from "../../domain/models/update-note-input-model";
import {
  NoteDoc,
  NoteDocTransformer,
  notesCollection,
} from "../collections/notes-collection";

export class NotesRepositoryImpl implements NotesRepository {
  private readonly notes: typeof notesCollection.type;

  constructor(mongoService: MongoService) {
    this.notes = mongoService.collection(notesCollection);
  }
  async createNote(note: CreateNoteInputModel): Promise<NoteModel> {
    const newNote = {
      courseId: new ObjectId(note.courseId),
      front: note.front,
      back: note.back,
      createdAt: new Date(),
    } as WithId<NoteDoc>;
    await this.notes.insertOne(newNote);
    return new NoteDocTransformer(newNote).toDomain();
  }

  async getNote(noteId: string): Promise<NoteModel | null> {
    const note = await this.notes.findOne({ _id: new ObjectId(noteId) });
    return note && new NoteDocTransformer(note).toDomain();
  }

  async updateNote(note: UpdateNoteInputModel): Promise<void> {
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

  async deleteNote(noteId: string): Promise<void> {
    await this.notes.deleteOne({ _id: new ObjectId(noteId) });
  }

  async getNotes({
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
}
