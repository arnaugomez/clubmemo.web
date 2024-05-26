import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import { locator } from "@/src/common/locator";
import { ApiErrorHandler } from "@/src/common/ui/api/api-error-handler";
import type { PropsWithIdParam } from "@/src/common/ui/models/props-with-id-param";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { fetchMyProfile } from "@/src/profile/ui/fetch/fetch-my-profile";
import { stringify } from "csv-stringify/sync";

export async function GET(_: Request, { params: { id } }: PropsWithIdParam) {
  try {
    const profile = await fetchMyProfile();
    const coursesRepository = await locator.CoursesRepository();
    const course = await coursesRepository.getDetail({
      id,
      profileId: profile?.id,
    });
    if (!course) throw new CourseDoesNotExistError();
    if (!course.canView) throw new NoPermissionError();
    const notesRepository = await locator.NotesRepository();
    const rows = await notesRepository.getAllRows(id);
    const csvText = stringify(rows.map((row) => [row.front, row.back]));

    return new Response(csvText, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=data.csv",
      },
    });
  } catch (e) {
    return ApiErrorHandler.handle(e);
  }
}
