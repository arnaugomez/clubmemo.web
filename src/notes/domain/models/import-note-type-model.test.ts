import { describe } from "node:test";
import { expect, it } from "vitest";
import { ImportNotesTypeModel } from "./import-note-type-model";

describe("ImportNoteTypeModel", () => {
  it("enum type name should match string value", () => {
    expect(ImportNotesTypeModel.anki).toBe("anki");
    expect(ImportNotesTypeModel.json).toBe("json");
    expect(ImportNotesTypeModel.csv).toBe("csv");
  });
});
