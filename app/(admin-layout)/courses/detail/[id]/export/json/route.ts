import { NoPermissionError } from "@/src/common/domain/models/app-errors";
import { locator } from "@/src/common/locator";
import { ActionResponse } from "@/src/common/ui/models/server-form-errors";
import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import { fetchMyProfile } from "@/src/profile/ui/fetch/fetch-my-profile";

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