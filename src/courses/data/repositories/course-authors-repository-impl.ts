import * as Effect from "effect/Effect";
import { ObjectId } from "mongodb";
import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ExternalServiceError } from "@/src/common/effect/errors";
import type { CourseAuthorsRepository } from "../../domain/interfaces/course-authors-repository";
import { CoursePermissionTypeModel } from "../../domain/models/course-permission-type-model";
import type { CourseAuthorDoc } from "../aggregations/course-authors-aggregation";
import { CourseAuthorDocTransformer } from "../aggregations/course-authors-aggregation";
import { coursePermissionsCollection } from "../collections/course-permissions-collection";

/**
 * Implementation of the `CourseAuthorsRepository` with the MongoDB database
 */
export class CourseAuthorsRepositoryImpl implements CourseAuthorsRepository {
  private readonly collection: typeof coursePermissionsCollection.type;

  constructor(databaseService: DatabaseService) {
    this.collection = databaseService.collection(coursePermissionsCollection);
  }

  get = Effect.fn("CourseAuthorsRepositoryImpl.get")(function* (
    this: CourseAuthorsRepositoryImpl,
    courseId: string,
  ) {
    const aggregation = this.collection.aggregate<CourseAuthorDoc>([
      {
        $match: {
          courseId: new ObjectId(courseId),
          permissionType: {
            $in: [
              CoursePermissionTypeModel.own,
              CoursePermissionTypeModel.edit,
            ],
          },
        },
      },
      {
        $sort: { permissionType: -1 },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "profileId",
          foreignField: "_id",
          as: "profile",
        },
      },
      {
        $unwind: "$profile",
      },
      {
        $project: {
          courseId: true,
          permissionType: true,
          profileId: true,
          displayName: "$profile.displayName",
          picture: "$profile.picture",
          handle: "$profile.handle",
        },
      },
    ]);

    const result = yield* Effect.tryPromise({
      try: () => aggregation.toArray(),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "CourseAuthorsRepositoryImpl.get",
          cause,
        }),
    });
    return result.map((e) => new CourseAuthorDocTransformer(e).toDomain());
  }).bind(this);
}
