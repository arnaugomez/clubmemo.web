import { describe, expect, it } from "vitest";
import type { NoteModelData } from "./note-model";
import { NoteModel } from "./note-model";

describe("NoteModel", () => {
  const data: NoteModelData = {
    id: "note1",
    courseId: "course123",
    front: "<p>What is 2 + 2?</p>",
    back: "<p>4</p>",
    frontText: "What is 2 + 2?",
    backText: "4",
    createdAt: new Date(),
  };
  const note = new NoteModel(data);

  it("courseId should match data", () => {
    expect(note.courseId).toBe(data.courseId);
  });

  it("id should match data", () => {
    expect(note.id).toBe(data.id);
  });

  it("front should match data", () => {
    expect(note.front).toBe(data.front);
  });

  it("back should match data", () => {
    expect(note.back).toBe(data.back);
  });

  it("frontText should match data", () => {
    expect(note.frontText).toBe(data.frontText);
  });

  it("backText should match data", () => {
    expect(note.backText).toBe(data.backText);
  });

  it("createdAt should match data", () => {
    expect(note.createdAt).toEqual(data.createdAt);
  });
});
