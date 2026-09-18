import * as Schema from "effect/Schema";
import { FSRS } from "ts-fsrs";
import { CourseEnrollmentConfigModelDataSchema } from "@/src/courses/domain/models/course-enrollment-config-model";
import { CourseEnrollmentConfigModel } from "./course-enrollment-config-model";

export const CourseEnrollmentModelDataSchema = Schema.Struct({
  id: Schema.mutableKey(Schema.String),
  courseId: Schema.mutableKey(Schema.String),
  profileId: Schema.mutableKey(Schema.String),
  isFavorite: Schema.mutableKey(Schema.Boolean),
  config: Schema.mutableKey(
    Schema.optional(CourseEnrollmentConfigModelDataSchema),
  ),
});
export type CourseEnrollmentModelData =
  typeof CourseEnrollmentModelDataSchema.Type;

export class CourseEnrollmentModel extends Schema.Class<CourseEnrollmentModel>(
  "CourseEnrollmentModel",
)({ data: CourseEnrollmentModelDataSchema }) {
  constructor(data: CourseEnrollmentModelData) {
    super({ data });
  }

  get id() {
    return this.data.id;
  }

  get courseId() {
    return this.data.courseId;
  }

  get profileId() {
    return this.data.profileId;
  }

  get isFavorite() {
    return this.data.isFavorite;
  }

  get config() {
    if (!this.data.config) {
      return CourseEnrollmentConfigModel.empty();
    }
    return new CourseEnrollmentConfigModel(this.data.config);
  }

  get fsrs() {
    return new FSRS(this.config.fsrsGeneratorParameters);
  }
}
