import {
  InvalidFileFormatError,
  NoPermissionError,
} from "@/src/common/domain/models/app-errors";
import { CoursesRepository } from "@/src/courses/domain/interfaces/courses-repository";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { parse } from "csv-parse/sync";
import { z } from "zod";
import { NotesRepository } from "../interfaces/notes-repository";
import { ImportNotesTypeModel } from "../models/import-note-type-model";
import { ImportNotesInputModel } from "../models/import-notes-input-model";
import { NoteModel } from "../models/note-model";
import { NoteRowModel } from "../models/note-row-model";

export class ImportNotesUseCase {
  constructor(
    private readonly coursesRepository: CoursesRepository,
    private readonly notesRepository: NotesRepository,
  ) {}

  async execute({
    profileId,
    courseId,
    file,
    importType,
  }: ImportNotesInputModel): Promise<NoteModel[]> {
    const course = await this.coursesRepository.getDetail({
      id: courseId,
      profileId,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canEdit) throw new NoPermissionError();

    const parseMap = {
      [ImportNotesTypeModel.csv]: this.parseCsv,
      [ImportNotesTypeModel.json]: this.parseJson,
      [ImportNotesTypeModel.anki]: this.parseAnki,
    };
    const parseFn = parseMap[importType];
    if (!parseFn) throw new Error("parseFn does not exist");
    const newNotes = await parseFn(file);
    return await this.notesRepository.createMany(courseId, newNotes);
  }

  private async parseCsv(file: File): Promise<NoteRowModel[]> {
    const text = await file.text();
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
  private async parseJson(file: File): Promise<NoteRowModel[]> {
    const text = await file.text();
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
  private async parseAnki(file: File): Promise<NoteRowModel[]> {
    const text = await file.text();

    // Lexer to parse Anki format. Works like a finite state machine.
    enum Status {
      start,
      text,
      quote,
    }
    let status = Status.start;
    const records: string[][] = [];
    let currentRecord: string[] = [];
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
