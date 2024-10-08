import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ObjectId } from "mongodb";
import type { CoursePermissionsRepository } from "../../domain/interfaces/course-permissions-repository";
import { coursePermissionsCollection } from "../collections/course-permissions-collection";

export class CoursePermissionsRepositoryImpl
  implements CoursePermissionsRepository
{
  private readonly collection: typeof coursePermissionsCollection.type;

  constructor(databaseService: DatabaseService) {
    this.collection = databaseService.collection(coursePermissionsCollection);
  }

  async deleteByCourseId(courseId: string): Promise<void> {
    await this.collection.deleteMany({
      courseId: new ObjectId(courseId),
    });
  }
}
