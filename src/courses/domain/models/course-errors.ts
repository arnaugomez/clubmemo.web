import * as Schema from "effect/Schema";
export class CourseDoesNotExistError extends Schema.TaggedError<CourseDoesNotExistError>()(
  "CourseDoesNotExistError",
  {},
) {}
export class CannotEditCourseError extends Schema.TaggedError<CannotEditCourseError>()(
  "CannotEditCourseError",
  {},
) {}
export class CannotDeleteCourseError extends Schema.TaggedError<CannotDeleteCourseError>()(
  "CannotDeleteCourseError",
  {},
) {}
