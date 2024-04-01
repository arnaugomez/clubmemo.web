import { MongoService } from "@/src/core/app/domain/interfaces/mongo-service";
import { ObjectId, WithId } from "mongodb";
import { CoursesRepository } from "../../domain/interfaces/courses-repository";
import { CourseModel } from "../../domain/models/course-model";
import { CoursePermissionTypeModel } from "../../domain/models/course-permission-type-model";
import { CreateCourseInputModel } from "../../domain/models/create-course-input-model";
import { GetCourseDetailInputModel } from "../../domain/models/get-course-detail-input-model";
import { UpdateCourseInputModel } from "../../domain/models/update-course-input-model";
import {
  CourseEnrollmentDoc,
  courseEnrollmentsCollection,
} from "../collections/course-enrollments-collection";
import { coursePermissionsCollection } from "../collections/course-permissions-collection";
import {
  CourseDoc,
  CourseDocTransformer,
  coursesCollection,
} from "../collections/courses-collection";

export class CoursesRepositoryImpl implements CoursesRepository {
  private readonly courses: typeof coursesCollection.type;
  private readonly coursePermissions: typeof coursePermissionsCollection.type;
  private readonly courseEnrollments: typeof courseEnrollmentsCollection.type;

  constructor(mongoService: MongoService) {
    this.courses = mongoService.collection(coursesCollection);
    this.coursePermissions = mongoService.collection(
      coursePermissionsCollection,
    );
    this.courseEnrollments = mongoService.collection(
      courseEnrollmentsCollection,
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
      permissionType: CoursePermissionTypeModel.Own,
    });
    const insertedEnrollment = {
      courseId: insertedCourse._id,
      profileId: new ObjectId(input.profileId),
      isFavorite: false,
    } as WithId<CourseEnrollmentDoc>;
    await this.courseEnrollments.insertOne(insertedEnrollment);
    return new CourseDocTransformer(insertedCourse).toDomain(
      CoursePermissionTypeModel.Own,
      insertedEnrollment,
    );
  }

  async getDetail({
    id,
    profileId,
  }: GetCourseDetailInputModel): Promise<CourseModel | null> {
    const courseId = new ObjectId(id);
    const [course, permission, enrollment] = await Promise.all([
      this.courses.findOne({ _id: courseId }),
      this.coursePermissions.findOne({
        courseId,
        profileId: new ObjectId(profileId),
      }),
      this.courseEnrollments.findOne({
        courseId,
        profileId: new ObjectId(profileId),
      }),
    ]);
    if (!course) return null;
    return new CourseDocTransformer(course).toDomain(
      permission?.permissionType ?? null,
      enrollment,
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
      this.courseEnrollments.deleteMany({ courseId: _id }),
    ]);
  }
}
