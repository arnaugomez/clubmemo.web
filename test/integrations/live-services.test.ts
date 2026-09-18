// @vitest-environment node
import { randomUUID } from "node:crypto";
import dotenv from "dotenv";
import * as Effect from "effect/Effect";
import { describe, expect, it } from "vitest";
import { AiNotesGeneratorServiceOpenaiImpl } from "@/src/ai-generator/data/services/ai-notes-generator-service-openai-impl";
import { AiGeneratorNoteType } from "@/src/ai-generator/domain/models/ai-generator-note-type";
import { AiNotesGeneratorSourceType } from "@/src/ai-generator/domain/models/ai-notes-generator-source-type";
import { applicationConfig } from "@/src/common/data/services/env-service-impl";
import { FileUploadServiceS3Impl } from "@/src/file-upload/data/services/file-upload-service-s3-impl";

// Opt-in live checks use development integrations, retaining test environment overrides.
describe.runIf(process.env.EFFECT_LIVE_INTEGRATIONS === "1")(
  "live external services",
  () => {
    it("uploads, retrieves and deletes a uniquely owned S3 object", async () => {
      dotenv.config({ path: ".env.development.local" });
      await Effect.runPromise(
        Effect.scoped(
          Effect.gen(function* () {
            const config = yield* applicationConfig;
            const service = yield* Effect.acquireRelease(
              Effect.sync(() => new FileUploadServiceS3Impl(config)),
              (service) => Effect.sync(() => service.close()),
            );
            const key = `effect-migration-tests/${randomUUID()}`;
            yield* Effect.acquireRelease(Effect.void, () =>
              service.deleteFile(key).pipe(Effect.orDie),
            );
            const { url, fields } = yield* service.generatePresignedUrl({
              key,
              contentType: "text/plain",
            });
            const form = new FormData();
            for (const [name, value] of Object.entries(fields))
              form.append(name, value);
            form.append(
              "file",
              new Blob(["Effect v4 integration test"], { type: "text/plain" }),
              "test.txt",
            );
            const uploaded = yield* Effect.promise((signal) =>
              fetch(url, { method: "POST", body: form, signal }),
            );
            expect(uploaded.ok).toBe(true);
            const response = yield* Effect.promise((signal) =>
              fetch(url + fields.key, { signal }),
            );
            expect(yield* Effect.promise(() => response.text())).toBe(
              "Effect v4 integration test",
            );
          }),
        ),
      );
    }, 30_000);
    it("decodes live OpenAI structured flashcards through Effect Schema", async () => {
      dotenv.config({ path: ".env.development.local" });
      const notes = await Effect.runPromise(
        Effect.gen(function* () {
          const config = yield* applicationConfig;
          const service = new AiNotesGeneratorServiceOpenaiImpl(config, {
            captureError: (error) =>
              Effect.sync(() => {
                const cause = (
                  error as {
                    cause?: {
                      status?: number;
                      code?: string;
                      param?: string;
                      message?: string;
                    };
                  }
                ).cause;
                console.error("OpenAI response", {
                  status: cause?.status,
                  code: cause?.code,
                  param: cause?.param,
                  detail: cause?.status === 400 ? cause.message : undefined,
                });
              }),
          });
          return yield* service.generate({
            text: "El agua hierve a 100 grados Celsius al nivel del mar.",
            notesCount: 2,
            noteTypes: [AiGeneratorNoteType.qa],
            sourceType: AiNotesGeneratorSourceType.text,
          });
        }),
      );
      expect(notes.length).toBeGreaterThan(0);
      for (const note of notes) {
        expect(note.front.length).toBeGreaterThan(0);
        expect(note.back.length).toBeGreaterThan(0);
      }
    }, 45_000);
  },
);
