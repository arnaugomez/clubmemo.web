import * as Effect from "effect/Effect";
import { ObjectId } from "mongodb";
import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ExternalServiceError } from "@/src/common/effect/errors";
import type { CoursePermissionsRepository } from "../../domain/interfaces/course-permissions-repository";
import { coursePermissionsCollection } from "../collections/course-permissions-collection";

export class CoursePermissionsRepositoryImpl
  implements CoursePermissionsRepository
{
  private readonly collection: typeof coursePermissionsCollection.type;

  constructor(databaseService: DatabaseService) {
    this.collection = databaseService.collection(coursePermissionsCollection);
  }

  deleteByCourseId = Effect.fn(
    "CoursePermissionsRepositoryImpl.deleteByCourseId",
  )(function* (this: CoursePermissionsRepositoryImpl, courseId: string) {
    yield* Effect.tryPromise({
      try: () =>
        this.collection.deleteMany({
          courseId: new ObjectId(courseId),
        }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "CoursePermissionsRepositoryImpl.deleteByCourseId",
          cause,
        }),
    });
  }).bind(this);
}
