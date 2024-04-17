import {
  PaginationFacet,
  PaginationFacetTransformer,
} from "@/src/core/common/data/facets/pagination-facet";
import { MongoService } from "@/src/core/common/domain/interfaces/mongo-service";
import { SanitizeHtmlService } from "@/src/core/common/domain/interfaces/sanitize-html-service";
import { PaginationModel } from "@/src/core/common/domain/models/pagination-model";
import { ObjectId, WithId } from "mongodb";
import { NotesRepository } from "../../domain/interfaces/notes-repository";
import { CopyNotesInputModel } from "../../domain/models/copy-notes-input-model";
import { CreateNoteInputModel } from "../../domain/models/create-note-input-model";
import { GetNotesInputModel } from "../../domain/models/get-notes-input-model";
import { NoteModel } from "../../domain/models/note-model";
import { NoteRowModel } from "../../domain/models/note-row-model";
import { UpdateNoteInputModel } from "../../domain/models/update-note-input-model";
import {
  NoteDoc,
  NoteDocTransformer,
  notesCollection,
} from "../collections/notes-collection";

export class NotesRepositoryImpl implements NotesRepository {
  private readonly notes: typeof notesCollection.type;

  constructor(
    mongoService: MongoService,
    private readonly sanitizeHtmlService: SanitizeHtmlService,
  ) {
    this.notes = mongoService.collection(notesCollection);
  }
  copyAcrossCourses() {
    throw new Error("Method not implemented.");
  }
  async create(note: CreateNoteInputModel): Promise<NoteModel> {
    const newNote = {
      ...this.createSanitizedNoteAttributes(note),
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
        $set: this.createSanitizedNoteAttributes(note),
      },
    );
  }

  async delete(noteId: string): Promise<void> {
    await this.notes.deleteOne({ _id: new ObjectId(noteId) });
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
        ...this.createSanitizedNoteAttributes(note),
      };
      return newNote as WithId<NoteDoc>;
    });
    await this.notes.insertMany(newNotes);
    return newNotes.map((note) => new NoteDocTransformer(note).toDomain());
  }

  private createSanitizedNoteAttributes(note: { front: string; back: string }) {
    return {
      front: this.sanitizeHtmlService.sanitize(note.front),
      back: this.sanitizeHtmlService.sanitize(note.back),
      frontText: this.sanitizeHtmlService.getText(note.front),
      backText: this.sanitizeHtmlService.getText(note.back),
    };
  }
}
