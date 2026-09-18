import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import type { WithId } from "mongodb";
import { ObjectId } from "mongodb";
import type { PaginationFacet } from "@/src/common/data/facets/pagination-facet";
import { PaginationFacetTransformer } from "@/src/common/data/facets/pagination-facet";
import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { PaginationModel } from "@/src/common/domain/models/pagination-model";
import { ExternalServiceError } from "@/src/common/effect/errors";
import { practiceCardsCollection } from "@/src/practice/data/collections/practice-cards-collection";
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
  create = Effect.fn("NotesRepositoryImpl.create")(function* (
    this: NotesRepositoryImpl,
    note: CreateNoteInputModel,
  ) {
    const newNote = {
      front: note.front,
      back: note.back,
      courseId: new ObjectId(note.courseId),
      createdAt: yield* DateTime.nowAsDate,
    } as WithId<NoteDoc>;
    yield* Effect.tryPromise({
      try: () => this.notes.insertOne(newNote),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "NotesRepositoryImpl.create",
          cause,
        }),
    });
    return new NoteDocTransformer(newNote).toDomain();
  }).bind(this);

  getDetail = Effect.fn("NotesRepositoryImpl.getDetail")(function* (
    this: NotesRepositoryImpl,
    noteId: string,
  ) {
    const note = yield* Effect.tryPromise({
      try: () => this.notes.findOne({ _id: new ObjectId(noteId) }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "NotesRepositoryImpl.getDetail",
          cause,
        }),
    });
    return note && new NoteDocTransformer(note).toDomain();
  }).bind(this);

  update = Effect.fn("NotesRepositoryImpl.update")(function* (
    this: NotesRepositoryImpl,
    note: UpdateNoteInputModel,
  ) {
    yield* Effect.tryPromise({
      try: () =>
        this.notes.updateOne(
          { _id: new ObjectId(note.id) },
          {
            $set: {
              front: note.front,
              back: note.back,
            },
          },
        ),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "NotesRepositoryImpl.update",
          cause,
        }),
    });
  }).bind(this);

  delete = Effect.fn("NotesRepositoryImpl.delete")(function* (
    this: NotesRepositoryImpl,
    noteId: string,
  ) {
    yield* Effect.all(
      [
        Effect.tryPromise({
          try: () => this.notes.deleteOne({ _id: new ObjectId(noteId) }),
          catch: (cause) =>
            new ExternalServiceError({
              operation: "NotesRepositoryImpl.delete",
              cause,
            }),
        }),
        Effect.tryPromise({
          try: () =>
            this.practiceCards.deleteMany({ noteId: new ObjectId(noteId) }),
          catch: (cause) =>
            new ExternalServiceError({
              operation: "NotesRepositoryImpl.delete",
              cause,
            }),
        }),
      ],
      { concurrency: "unbounded" },
    );
  }).bind(this);

  deleteByCourseId = Effect.fn("NotesRepositoryImpl.deleteByCourseId")(
    function* (this: NotesRepositoryImpl, courseId: string) {
      yield* Effect.tryPromise({
        try: () => this.notes.deleteMany({ courseId: new ObjectId(courseId) }),
        catch: (cause) =>
          new ExternalServiceError({
            operation: "NotesRepositoryImpl.deleteByCourseId",
            cause,
          }),
      });
    },
  ).bind(this);

  get = Effect.fn("NotesRepositoryImpl.get")(function* (
    this: NotesRepositoryImpl,
    { courseId, page = 1, pageSize = 10 }: GetNotesInputModel,
  ) {
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

    const result = yield* Effect.tryPromise({
      try: () => aggregation.tryNext(),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "NotesRepositoryImpl.get",
          cause,
        }),
    });
    if (!result) {
      return PaginationModel.empty<NoteModel>();
    }
    return new PaginationFacetTransformer(result).toDomain((data) =>
      new NoteDocTransformer(data).toDomain(),
    );
  }).bind(this);

  copy = Effect.fn("NotesRepositoryImpl.copy")(function* (
    this: NotesRepositoryImpl,
    { sourceCourseId, targetCourseId }: CopyNotesInputModel,
  ) {
    const sourceCourseNotes = yield* Effect.tryPromise({
      try: () =>
        this.notes.find({ courseId: new ObjectId(sourceCourseId) }).toArray(),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "NotesRepositoryImpl.copy",
          cause,
        }),
    });
    if (!sourceCourseNotes.length) return;
    const newNotes = sourceCourseNotes.map((note) => {
      return {
        ...note,
        _id: undefined,
        courseId: new ObjectId(targetCourseId),
      };
    });
    yield* Effect.tryPromise({
      try: () => this.notes.insertMany(newNotes),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "NotesRepositoryImpl.copy",
          cause,
        }),
    });
  }).bind(this);
  getAllRows = Effect.fn("NotesRepositoryImpl.getAllRows")(function* (
    this: NotesRepositoryImpl,
    courseId: string,
  ) {
    return yield* Effect.tryPromise({
      try: () =>
        this.notes
          .find(
            { courseId: new ObjectId(courseId) },
            {
              sort: { createdAt: -1 },
              limit: 1000,
              projection: { _id: false, front: true, back: true },
            },
          )
          .toArray(),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "NotesRepositoryImpl.getAllRows",
          cause,
        }),
    });
  }).bind(this);

  createMany = Effect.fn("NotesRepositoryImpl.createMany")(function* (
    this: NotesRepositoryImpl,
    courseIdString: string,
    notes: NoteRowModel[],
  ) {
    if (!notes.length) return [];
    const courseId = new ObjectId(courseIdString);
    const now = yield* DateTime.nowAsDate;

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
    yield* Effect.tryPromise({
      try: () => this.notes.insertMany(newNotes),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "NotesRepositoryImpl.createMany",
          cause,
        }),
    });
    return newNotes.map((note) => new NoteDocTransformer(note).toDomain());
  }).bind(this);
}
