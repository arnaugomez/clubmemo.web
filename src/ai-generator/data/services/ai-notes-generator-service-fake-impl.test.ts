import * as Effect from "effect/Effect";
import { describe, expect, it } from "vitest";
import { AiNotesGeneratorSourceType } from "../../domain/models/ai-notes-generator-source-type";
import { AiNotesGeneratorServiceFakeImpl } from "./ai-notes-generator-service-fake-impl";

describe("AiNotesGeneratorServiceFakeImpl", () => {
  it("generate returns a non-empty list of notes regardless of the input", async () => {
    const aiNotesGeneratorServiceFakeImpl =
      new AiNotesGeneratorServiceFakeImpl();

    await expect(
      Effect.runPromise(
        aiNotesGeneratorServiceFakeImpl.generate({
          notesCount: 0,
          noteTypes: [],
          sourceType: AiNotesGeneratorSourceType.file,
          text: "",
        }),
      ),
    ).resolves.not.toHaveLength(0);
    await expect(
      Effect.runPromise(
        aiNotesGeneratorServiceFakeImpl.generate({
          notesCount: 10000,
          noteTypes: [],
          sourceType: AiNotesGeneratorSourceType.text,
          text: "Example Test",
        }),
      ),
    ).resolves.not.toHaveLength(0);
  });
});
