import { parse } from "csv-parse/sync";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import {
  InvalidFileFormatError,
  NoPermissionError,
} from "@/src/common/domain/models/app-errors";
import { ExternalServiceError } from "@/src/common/effect/errors";
import { CoursesRepository } from "@/src/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import { NotesRepository } from "../interfaces/notes-repository";
import { ImportNotesTypeModel } from "../models/import-note-type-model";
import type { ImportNotesInputModel } from "../models/import-notes-input-model";

/**
 * Imports notes from a file into a course. Reads the file and parses it
 * to get the data of the notes. Then, adds the notes to the course.
 *
 * @param {courseId} The id of the course to import the notes
 */
export class ImportNotesUseCase extends Context.Service<ImportNotesUseCase>()(
  "clubmemo/notes/domain/use-cases/import-notes-use-case",
  {
    make: Effect.gen(function* () {
      const getMyProfileUseCase = yield* GetMyProfileUseCase;
      const coursesRepository = yield* CoursesRepository;
      const notesRepository = yield* NotesRepository;
      const execute = Effect.fn("ImportNotesUseCase.execute")(function* ({
        courseId,
        file,
        importType,
      }: ImportNotesInputModel) {
        const profile = yield* getMyProfileUseCase.execute();
        if (!profile) return yield* Effect.fail(new ProfileDoesNotExistError());

        const course = yield* coursesRepository.getDetail({
          id: courseId,
          profileId: profile.id,
        });
        if (!course) return yield* Effect.fail(new CourseDoesNotExistError());
        if (!course.canEdit) return yield* Effect.fail(new NoPermissionError());

        const parseMap = {
          [ImportNotesTypeModel.csv]: parseCsv,
          [ImportNotesTypeModel.json]: parseJson,
          [ImportNotesTypeModel.anki]: parseAnki,
        };

        const parseFn = parseMap[importType];
        const text = yield* Effect.tryPromise({
          try: () => file.text(),
          catch: (cause) =>
            new ExternalServiceError({
              operation: "ImportNotesUseCase.execute",
              cause,
            }),
        });
        const newNotes = yield* parseFn(text);
        return yield* notesRepository.createMany(courseId, newNotes);
      });
      const parseCsv = Effect.fn("ImportNotesUseCase.parseCsv")(function* (
        text: string,
      ) {
        const records = yield* Effect.try({
          try: () => parse(text, { skip_empty_lines: true }) as string[][],
          catch: () => new InvalidFileFormatError(),
        });
        return records
          .map((record) => ({
            front: record[0] ?? "",
            back: record[1] ?? "",
          }))
          .filter((note) => note.front);
      });
      const parseJson = Effect.fn("ImportNotesUseCase.parseJson")(function* (
        text: string,
      ) {
        return yield* Effect.gen(function* () {
          const parsed = yield* Schema.decodeUnknownEffect(
            Schema.fromJsonString(ImportNotesJsonSchema),
          )(text);
          return parsed.notes
            .map((record) => ({
              front: record[0] ?? "",
              back: record[1] ?? "",
            }))
            .filter((note) => note.front);
        }).pipe(
          Effect.catch((_e) =>
            Effect.gen(function* () {
              return yield* Effect.fail(new InvalidFileFormatError());
            }),
          ),
        );
      });
      const parseAnki = Effect.fn("ImportNotesUseCase.parseAnki")(function* (
        text: string,
      ) {
        // There is no JavaScript library to parse Anki files, so we have to write our own parser.
        // To do this, we create a lexer that works like a finite state machine.
        enum Status {
          /** The initial state, before starting to read a field. */
          start,
          /** The state when reading a field and its text content */
          text,
          /**
           * The finite state machine transitions to this state when it is in the state `start` and
           * reads a quote character. This quote character might mark the end of the field or be an
           * escaped quote character.
           */
          quote,
        }
        /** The current state of the finite state machine */
        let status = Status.start;
        /** The data of the notes */
        const records: string[][] = [];
        /** The note that is currently being analyzed */
        let currentRecord: string[] = [];
        /** The field that is currently being read */
        let currentField: string = "";
        for (const char of text) {
          switch (status) {
            case Status.start:
              if (char === '"') {
                status = Status.text;
              } else if (char === "\n") {
                records.push(currentRecord);
                currentRecord = [];
              }
              break;
            case Status.text:
              if (char === '"') {
                status = Status.quote;
              } else {
                currentField += char;
              }
              break;
            case Status.quote:
              if (char === '"') {
                status = Status.text;
                currentField += char;
              } else if (char === "\t") {
                status = Status.start;
                currentRecord.push(currentField);
                currentField = "";
              } else {
                return yield* Effect.fail(new InvalidFileFormatError());
              }
              break;
          }
        }
        if (currentRecord.length) {
          records.push(currentRecord);
        }
        return records
          .map((record) => ({
            front: record[0] ?? "",
            back: record[1] ?? "",
          }))
          .filter((note) => note.front);
      });
      return { execute };
    }),
  },
) {}

const ImportNotesJsonSchema = Schema.Struct({
  notes: Schema.mutable(
    Schema.Array(Schema.mutable(Schema.Tuple([Schema.String, Schema.String]))),
  ),
});

export const ImportNotesUseCaseService = ImportNotesUseCase;
