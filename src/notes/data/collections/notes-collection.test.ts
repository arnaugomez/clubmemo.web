import type { NoteDoc } from "@/src/notes/data/collections/notes-collection";
import { NoteDocTransformer } from "@/src/notes/data/collections/notes-collection";
import { NoteModel } from "@/src/notes/domain/models/note-model";
import type { WithId } from "mongodb";
import { ObjectId } from "mongodb";
import { describe, expect, it } from "vitest";

describe("NoteDocTransformer", () => {
  it("transforms NoteDoc to NoteModel correctly and sanitizes", () => {
    const mockNoteDoc: WithId<NoteDoc> = {
      _id: new ObjectId(),
      courseId: new ObjectId(),
      front: '<script>alert("xss")</script><p>Front content</p>',
      back: '<img src="x" onerror="alert(\'xss\')"/><p>Back content</p>',
      createdAt: new Date("2023-01-01"),
    };
    const transformer = new NoteDocTransformer(mockNoteDoc);
    const noteModel = transformer.toDomain();

    expect(noteModel).toBeInstanceOf(NoteModel);
    expect(noteModel.id).toBe(mockNoteDoc._id.toString());
    expect(noteModel.courseId).toBe(mockNoteDoc.courseId.toString());
    expect(noteModel.front).toBe("<p>Front content</p>");
    expect(noteModel.back).toBe('<img src="x"><p>Back content</p>');
    expect(noteModel.frontText).toBe("Front content");
    expect(noteModel.backText).toBe("Back content");
    expect(noteModel.createdAt).toBe(mockNoteDoc.createdAt);
  });
});
