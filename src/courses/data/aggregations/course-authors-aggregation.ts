import { ObjectId } from "mongodb";
import { CourseAuthorModel } from "../../domain/models/course-author-model";
import { CoursePermissionTypeModel } from "../../domain/models/course-permission-type-model";

export interface CourseAuthorDoc {
  courseId: ObjectId;
  permissionType: CoursePermissionTypeModel;

  profileId: ObjectId;
  displayName?: string;
  picture?: string;
  handle: string;
}

export class CourseAuthorDocTransformer {
  constructor(private readonly doc: CourseAuthorDoc) {}

  toDomain() {
    return new CourseAuthorModel({
      courseId: this.doc.courseId.toString(),
      permissionType: this.doc.permissionType,

      profileId: this.doc.profileId.toString(),
      displayName: this.doc.displayName,
      picture: this.doc.picture,
      handle: this.doc.handle,
    });
  }
}
