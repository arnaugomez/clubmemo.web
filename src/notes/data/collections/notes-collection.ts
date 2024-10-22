import { collection } from "@/src/common/data/utils/mongodb";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import type { ObjectId, WithId } from "mongodb";
import { NoteModel } from "../../domain/models/note-model";

export interface NoteDoc {
  courseId: ObjectId;
  front: string;
  back: string;
  createdAt: Date;
}

/**
 * Collection of MongoDB documents of type `NoteDoc`
 */
export const notesCollection = collection<NoteDoc>()("notes");

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
      frontText: this.removeHtmlTags(this.doc.front),
      backText: this.removeHtmlTags(this.doc.back),
      createdAt: this.doc.createdAt,
    });
  }

  private removeHtmlTags(text: string): string {
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: ["#text"] });
  }
}
