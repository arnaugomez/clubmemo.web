import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ObjectId } from "mongodb";
import type { CourseAuthorsRepository } from "../../domain/interfaces/course-authors-repository";
import type { CourseAuthorModel } from "../../domain/models/course-author-model";
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

  async get(courseId: string): Promise<CourseAuthorModel[]> {
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

    const result = await aggregation.toArray();
    return result.map((e) => new CourseAuthorDocTransformer(e).toDomain());
  }
}
