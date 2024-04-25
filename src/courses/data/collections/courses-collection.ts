import { collection } from "@/src/common/data/utils/mongo";
import { WithId } from "mongodb";
import { CourseModel } from "../../domain/models/course-model";
import { CoursePermissionTypeModel } from "../../domain/models/course-permission-type-model";
import {
  CourseEnrollmentDoc,
  CourseEnrollmentDocTransformer,
} from "./course-enrollments-collection";

export interface CourseDoc {
  name: string;
  description?: string;
  picture?: string;
  isPublic: boolean;
  tags?: string[];
}
export const coursesCollection = collection<CourseDoc>("courses");

export class CourseDocTransformer {
  constructor(private readonly course: WithId<CourseDoc>) {}

  toDomain(
    permissionType: CoursePermissionTypeModel | null,
    enrollment: WithId<CourseEnrollmentDoc> | null,
  ): CourseModel {
    const { _id, ...rest } = this.course;
    return new CourseModel({
      ...rest,
      id: _id.toString(),
      permissionType,
      enrollment: enrollment
        ? new CourseEnrollmentDocTransformer(enrollment).toDomain().data
        : null,
    });
  }
}
