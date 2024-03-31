import { MongoService } from "@/src/core/app/domain/interfaces/mongo-service";
import { ObjectId, WithId } from "mongodb";
import { CoursesRepository } from "../../domain/interfaces/courses-repository";
import { CourseModel } from "../../domain/models/course-model";
import { CreateCourseInputModel } from "../../domain/models/create-course-input-model";
import { GetCourseDetailInputModel } from "../../domain/models/get-course-detail-input-model";
import { UpdateCourseInputModel } from "../../domain/models/update-course-input-model";
import { coursePermissionsCollection } from "../collections/course-permissions-collection";
import {
  CourseDoc,
  CourseDocTransformer,
  coursesCollection,
} from "../collections/courses-collection";

export class CoursesRepositoryImpl implements CoursesRepository {
  private readonly courses: typeof coursesCollection.type;
  private readonly coursePermissions: typeof coursePermissionsCollection.type;

  constructor(mongoService: MongoService) {
    this.courses = mongoService.collection(coursesCollection);
    this.coursePermissions = mongoService.collection(
      coursePermissionsCollection,
    );
  }
  async create(input: CreateCourseInputModel): Promise<CourseModel> {
    const insertedCourse = {
      name: input.name,
      isPublic: false,
    } as WithId<CourseDoc>;
    await this.courses.insertOne(insertedCourse);
    await this.coursePermissions.insertOne({
      courseId: insertedCourse._id,
      profileId: new ObjectId(input.profileId),
      permissionType: "own",
    });
    return new CourseDocTransformer(insertedCourse).toDomain("own");
  }

  async getDetail({
    id,
    profileId,
  }: GetCourseDetailInputModel): Promise<CourseModel | null> {
    const courseId = new ObjectId(id);
    const [course, permission] = await Promise.all([
      this.courses.findOne({ _id: courseId }),
      this.coursePermissions.findOne({
        courseId,
        profileId: new ObjectId(profileId),
      }),
    ]);
    if (!course) return null;
    return new CourseDocTransformer(course).toDomain(
      permission?.permissionType,
    );
  }

  async update({ id, ...input }: UpdateCourseInputModel): Promise<void> {
    await this.courses.updateOne({ _id: new ObjectId(id) }, { $set: input });
  }

  async delete(id: string): Promise<void> {
    const _id = new ObjectId(id);
    await Promise.all([
      this.courses.deleteOne({ _id }),
      this.coursePermissions.deleteMany({ courseId: _id }),
    ]);
  }
}