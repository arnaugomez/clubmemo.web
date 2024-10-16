import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import { ApiErrorHandler } from "@/src/common/ui/api/api-error-handler";
import type { PropsWithIdParam } from "@/src/common/ui/models/props-with-id-param";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { locator_courses_CoursesRepository } from "@/src/courses/locators/locator_courses-repository";
import { locator_notes_NotesRepository } from "@/src/notes/locators/locator_notes-repository";
import { fetchMyProfile } from "@/src/profile/ui/fetch/fetch-my-profile";

/**
 * Returns a txt file with the notes of a course in Anki (plain text) format.
 */
export async function GET(_: Request, { params: { id } }: PropsWithIdParam) {
  try {
    const profile = await fetchMyProfile();
    const coursesRepository = locator_courses_CoursesRepository();
    const course = await coursesRepository.getDetail({
      id,
      profileId: profile?.id,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canView) throw new NoPermissionError();
    const notesRepository = locator_notes_NotesRepository();
    const rows = await notesRepository.getAllRows(id);
    const text = rows
      .map((row) =>
        [row.front, row.back]
          .map((cell) => cell.replace('"', '""'))
          .map((cell) => `"${cell}"\t`)
          .join(""),
      )
      .map((row) => row + "\n")
      .join("");

    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": "attachment; filename=anki.txt",
      },
    });
  } catch (e) {
    return ApiErrorHandler.handle(e);
  }
}
