import { collection } from "@/src/common/data/utils/mongo";
import createDOMPurify from "dompurify";
import type { ObjectId, WithId } from "mongodb";
import { NoteModel } from "../../domain/models/note-model";
import { JSDOM } from "jsdom";

export interface NoteDoc {
  courseId: ObjectId;
  front: string;
  back: string;
  createdAt: Date;
}

/**
 * Collection of MongoDB documents of type `NoteDoc`
 */
export const notesCollection = collection<NoteDoc>("notes");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);
export class NoteDocTransformer {
  constructor(private readonly doc: WithId<NoteDoc>) {}
  toDomain() {
    return new NoteModel({
      id: this.doc._id.toString(),
      courseId: this.doc.courseId.toString(),
      front: DOMPurify.sanitize(this.doc.front),
      back: DOMPurify.sanitize(this.doc.back),
      frontText: DOMPurify.sanitize(this.doc.front, {
        ALLOWED_TAGS: ["#text"],
      }),
      backText: DOMPurify.sanitize(this.doc.back, { ALLOWED_TAGS: ["#text"] }),
      createdAt: this.doc.createdAt,
    });
  }
}
