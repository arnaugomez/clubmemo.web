import { NoPermissionError } from "@/src/core/common/domain/models/app-errors";
import { locator } from "@/src/core/common/locator";
import { CourseDoesNotExistError } from "@/src/core/courses/domain/models/course-errors";
import { fetchMyProfile } from "@/src/ui/features/profile/fetch/fetch-my-profile";
import { ActionResponse } from "@/src/ui/models/server-form-errors";

export async function GET(
  _: Request,
  { params: { id } }: { params: { id: string } },
) {
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
    if (e instanceof CourseDoesNotExistError) {
      return Response.json(
        ActionResponse.formGlobalError("profileDoesNotExist"),
        { status: 404 },
      );
    } else if (e instanceof NoPermissionError) {
      return Response.json(ActionResponse.formGlobalError("noPermission"), {
        status: 403,
      });
    }
    // TODO: report error
    console.error(e);
    return new Response(e?.toString?.(), { status: 500 });
  }
}
