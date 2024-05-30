import { locator } from "@/src/common/di/locator";
import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import { ApiErrorHandler } from "@/src/common/ui/api/api-error-handler";
import type { PropsWithIdParam } from "@/src/common/ui/models/props-with-id-param";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { fetchMyProfile } from "@/src/profile/ui/fetch/fetch-my-profile";

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

    return Response.json(
      {
        version: "1.0.0",
        notes: rows.map((row) => [row.front, row.back]),
      },
      {
        status: 200,
        headers: {
          "Content-Disposition": "attachment; filename=data.json",
        },
      },
    );
  } catch (e) {
    return ApiErrorHandler.handle(e);
  }
}
