import { z } from "@/i18n/zod";
import {
  InvalidFileFormatError,
  NoPermissionError,
} from "@/src/common/domain/models/app-errors";
import type { CoursesRepository } from "@/src/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { ProfileDoesNotExistError } from "@/src/profile/domain/errors/profile-errors";
import type { GetMyProfileUseCase } from "@/src/profile/domain/use-cases/get-my-profile-use-case";
import { parse } from "csv-parse/sync";
import type { NotesRepository } from "../interfaces/notes-repository";
import { ImportNotesTypeModel } from "../models/import-note-type-model";
import type { ImportNotesInputModel } from "../models/import-notes-input-model";
import type { NoteModel } from "../models/note-model";
import type { NoteRowModel } from "../models/note-row-model";

/**
 * Imports notes from a file into a course. Reads the file and parses it
 * to get the data of the notes. Then, adds the notes to the course.
 *
 * @param {courseId} The id of the course to import the notes
 */
export class ImportNotesUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly coursesRepository: CoursesRepository,
    private readonly notesRepository: NotesRepository,
  ) {}

  /**
   * Imports notes from a file into a course. Reads the file and parses it
   * to get the data of the notes. Then, adds the notes to the course.
   *
   * There are three types of files that can be imported: CSV, JSON, and Anki txt file.
   *
   * @param input The input data to import notes, including the course id, the file, and the type of the file
   */
  async execute({
    courseId,
    file,
    importType,
  }: ImportNotesInputModel): Promise<NoteModel[]> {
    const profile = await this.getMyProfileUseCase.execute();
    if (!profile) throw new ProfileDoesNotExistError();

    const course = await this.coursesRepository.getDetail({
      id: courseId,
      profileId: profile.id,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canEdit) throw new NoPermissionError();

    const parseMap = {
      [ImportNotesTypeModel.csv]: this.parseCsv,
      [ImportNotesTypeModel.json]: this.parseJson,
      [ImportNotesTypeModel.anki]: this.parseAnki,
    };

    const parseFn = parseMap[importType];
    const text = await file.text();
    const newNotes = await parseFn(text);
    return await this.notesRepository.createMany(courseId, newNotes);
  }

  /**
   * Analyzes the text of a CSV file and parses it to get the notes. The CSV
   * file must have at least two columns: the front of the note and the back of
   * the notes. The other columns are ignored.
   *
   * @param text The csv text to parse
   * @returns The extracted notes
   */
  private async parseCsv(text: string): Promise<NoteRowModel[]> {
    const records = parse(text, {
      skip_empty_lines: true,
    }) as string[][];
    return records
      .map((record) => ({
        front: record[0] ?? "",
        back: record[1] ?? "",
      }))
      .filter((note) => note.front);
  }

  /**
   * Analyzes a JSON text, checks that it is valid and parses it to get the notes. The JSON
   * must conform to `ImportNotesJsonSchema` and have a property "notes" that is an array of
   * the notes.
   *
   * @param text The json text to parse
   * @throws {InvalidFileFormatError} When the JSON is not valid
   * @returns The extracted notes
   */
  private async parseJson(text: string): Promise<NoteRowModel[]> {
    try {
      const parsed = ImportNotesJsonSchema.parse(JSON.parse(text));
      return parsed.notes
        .map((record) => ({
          front: record[0] ?? "",
          back: record[1] ?? "",
        }))
        .filter((note) => note.front);
    } catch (e) {
      throw new InvalidFileFormatError();
    }
  }

  /**
   * Analyzes a text in Anki txt file format and parses it to get the notes.
   * Learn more about the Anki txt file format at https://docs.ankiweb.net/exporting.html#text-files
   *
   * There is no JavaScript library to parse Anki files, so we have to write our own parser.
   * To do
   *
   * @param text The text to format
   * @throws {InvalidFileFormatError} When the input is not valid
   * @returns The extracted notes
   */
  private async parseAnki(text: string): Promise<NoteRowModel[]> {
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
            throw new InvalidFileFormatError();
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
  }
}

const ImportNotesJsonSchema = z.object({
  notes: z.array(z.tuple([z.string(), z.string()])),
});
