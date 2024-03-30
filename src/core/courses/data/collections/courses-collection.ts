import { collection } from "@/src/core/app/utils/mongo";
import { WithId } from "mongodb";
import { CourseModel } from "../../domain/models/course-model";
import { CoursePermissionTypeModel } from "../../domain/models/course-permission-type-model";

export interface CourseDoc {
  name: string;
  description?: string;
  picture?: string;
  isPublic: boolean;
}
export const coursesCollection = collection<CourseDoc>("courses");

export class CourseDocTransformer {
  constructor(private readonly course: WithId<CourseDoc>) {}

  toDomain(permissionType?: CoursePermissionTypeModel): CourseModel {
    const { _id, ...rest } = this.course;
    return new CourseModel({
      ...rest,
      id: _id.toString(),
      permissionType,
    });
  }
}
