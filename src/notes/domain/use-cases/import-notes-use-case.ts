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

export class ImportNotesUseCase {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly coursesRepository: CoursesRepository,
    private readonly notesRepository: NotesRepository,
  ) {}

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
  private async parseAnki(text: string): Promise<NoteRowModel[]> {
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
