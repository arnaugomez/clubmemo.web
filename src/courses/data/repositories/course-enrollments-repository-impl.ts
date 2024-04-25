import { MongoService } from "@/src/common/domain/interfaces/mongo-service";
import { ObjectId } from "mongodb";
import {
  CourseEnrollmentsRepository,
  CreateCourseEnrollmentInputModel,
  DeleteCourseEnrollmentInputModel,
  SetCourseFavoriteInputModel,
  UpdateCourseEnrollmentConfigInputModel,
} from "../../domain/interfaces/course-enrollments-repository";
import { CourseEnrollmentModel } from "../../domain/models/course-enrollment-model";
import {
  CourseEnrollmentDocTransformer,
  courseEnrollmentsCollection,
} from "../collections/course-enrollments-collection";

export class CourseEnrollmentsRepositoryImpl
  implements CourseEnrollmentsRepository
{
  private readonly collection: typeof courseEnrollmentsCollection.type;

  constructor(mongoService: MongoService) {
    this.collection = mongoService.collection(courseEnrollmentsCollection);
  }

  async create(input: CreateCourseEnrollmentInputModel): Promise<void> {
    await this.collection.insertOne({
      courseId: new ObjectId(input.courseId),
      profileId: new ObjectId(input.profileId),
      isFavorite: false,
    });
  }

  async get(id: string): Promise<CourseEnrollmentModel | null> {
    const result = await this.collection.findOne({ _id: new ObjectId(id) });
    return result && new CourseEnrollmentDocTransformer(result).toDomain();
  }

  async setFavorite(input: SetCourseFavoriteInputModel): Promise<void> {
    await this.collection.updateOne(
      {
        courseId: new ObjectId(input.courseId),
        profileId: new ObjectId(input.profileId),
      },
      {
        $set: { isFavorite: input.isFavorite },
      },
    );
  }

  async delete(input: DeleteCourseEnrollmentInputModel): Promise<void> {
    await this.collection.deleteOne({
      courseId: new ObjectId(input.courseId),
      profileId: new ObjectId(input.profileId),
    });
  }

  async updateConfig(
    input: UpdateCourseEnrollmentConfigInputModel,
  ): Promise<void> {
    await this.collection.updateOne(
      {
        _id: new ObjectId(input.enrollmentId),
      },
      {
        $set: {
          config: {
            enableFuzz: input.enableFuzz,
            maximumInterval: input.maximumInterval,
            requestRetention: input.requestRetention,
            dailyNewCardsCount: input.dailyNewCardsCount,
            showAdvancedRatingOptions: input.showAdvancedRatingOptions,
          },
        },
      },
    );
  }
}
