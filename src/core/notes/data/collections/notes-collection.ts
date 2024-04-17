import { collection } from "@/src/core/common/utils/mongo";
import { ObjectId, WithId } from "mongodb";
import { NoteModel } from "../../domain/models/note-model";

export interface NoteDoc {
  courseId: ObjectId;
  front: string;
  back: string;
  frontText: string;
  backText: string;
  createdAt: Date;
}

export const notesCollection = collection<NoteDoc>("notes");

export class NoteDocTransformer {
  constructor(private readonly doc: WithId<NoteDoc>) {}
  toDomain() {
    return new NoteModel({
      id: this.doc._id.toHexString(),
      courseId: this.doc.courseId.toHexString(),
      front: this.doc.front,
      back: this.doc.back,
      frontText: this.doc.frontText,
      backText: this.doc.backText,
      createdAt: this.doc.createdAt,
    });
  }
}
