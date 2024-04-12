import { MongoService } from "@/src/core/common/domain/interfaces/mongo-service";
import { ObjectId } from "mongodb";
import { CourseAuthorsRepository } from "../../domain/interfaces/course-authors-repository";
import { CourseAuthorModel } from "../../domain/models/course-author-model";
import { CoursePermissionTypeModel } from "../../domain/models/course-permission-type-model";
import {
  CourseAuthorDoc,
  CourseAuthorDocTransformer,
} from "../aggregations/course-authors-aggregation";
import { coursePermissionsCollection } from "../collections/course-permissions-collection";

export class CourseAuthorsRepositoryImpl implements CourseAuthorsRepository {
  private readonly collection: typeof coursePermissionsCollection.type;

  constructor(mongoService: MongoService) {
    this.collection = mongoService.collection(coursePermissionsCollection);
  }

  async get(courseId: string): Promise<CourseAuthorModel[]> {
    const aggregation = this.collection.aggregate<CourseAuthorDoc>([
      {
        $match: {
          courseId: new ObjectId(courseId),
          permissionType: {
            $in: [
              CoursePermissionTypeModel.Own,
              CoursePermissionTypeModel.Edit,
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
