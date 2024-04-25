import { collection } from "@/src/common/data/utils/mongo";
import { ObjectId, WithId } from "mongodb";
import { NoteModel } from "../../domain/models/note-model";

export interface NoteDoc {
  courseId: ObjectId;
  front: string;
  back: string;
  createdAt: Date;
}

export const notesCollection = collection<NoteDoc>("notes");

export class NoteDocTransformer {
  constructor(private readonly doc: WithId<NoteDoc>) {}
  toDomain() {
    return new NoteModel({
      id: this.doc._id.toString(),
      courseId: this.doc.courseId.toString(),
      front: this.doc.front,
      back: this.doc.back,
      createdAt: this.doc.createdAt,
    });
  }
}
