import { MongoService } from "@/src/core/app/domain/interfaces/mongo-service";
import { ObjectId } from "mongodb";
import {
  CourseEnrollmentsRepository,
  CreateCourseEnrollmentInputModel,
  DeleteCourseEnrollmentInputModel,
  SetCourseFavoriteInputModel,
} from "../../domain/interfaces/course-enrollments-repository";
import { courseEnrollmentsCollection } from "../collections/course-enrollments-collection";

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
}
