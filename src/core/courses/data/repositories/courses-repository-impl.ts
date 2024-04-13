import {
  PaginationFacet,
  PaginationFacetTransformer,
} from "@/src/core/common/data/services/facets/pagination-facet";
import { DateTimeService } from "@/src/core/common/domain/interfaces/date-time-service";
import { MongoService } from "@/src/core/common/domain/interfaces/mongo-service";
import { PaginationModel } from "@/src/core/common/domain/models/pagination-model";
import { TokenPaginationModel } from "@/src/core/common/domain/models/token-pagination-model";
import { practiceCardsCollection } from "@/src/core/practice/data/collections/practice-cards-collection";
import { reviewLogsCollection } from "@/src/core/practice/data/collections/review-logs-collection";
import { PracticeCardStateModel } from "@/src/core/practice/domain/models/practice-card-state-model";
import { ObjectId, WithId } from "mongodb";
import {
  CoursesRepository,
  GetCoursesByAuthorInputModel,
  GetDiscoverCoursesInputModel,
  GetHasCoursesInputModel,
  GetMyCoursesInputModel,
  GetMyCoursesPaginationInputModel,
} from "../../domain/interfaces/courses-repository";
import { CourseModel } from "../../domain/models/course-model";
import { CoursePermissionTypeModel } from "../../domain/models/course-permission-type-model";
import { CreateCourseInputModel } from "../../domain/models/create-course-input-model";
import { DiscoverCourseModel } from "../../domain/models/discover-course-model";
import { EnrolledCourseListItemModel } from "../../domain/models/enrolled-course-list-item-model";
import { GetCourseDetailInputModel } from "../../domain/models/get-course-detail-input-model";
import { UpdateCourseInputModel } from "../../domain/models/update-course-input-model";
import {
  DiscoverCourseDoc,
  DiscoverCourseTransformer,
} from "../aggregations/discover-course-aggregation";
import {
  EnrolledCourseListItemDoc,
  EnrolledCourseListItemTransformer,
} from "../aggregations/enrolled-course-list-item-aggregation";
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
import {
  TokenPaginationTransformer,
  WithPaginationToken,
} from "../models/with-pagination-token";

export class CoursesRepositoryImpl implements CoursesRepository {
  private readonly courses: typeof coursesCollection.type;
  private readonly coursePermissions: typeof coursePermissionsCollection.type;
  private readonly courseEnrollments: typeof courseEnrollmentsCollection.type;

  constructor(
    mongoService: MongoService,
    private readonly dateTimeService: DateTimeService,
  ) {
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

  async getMyCourses({
    profileId,
    isFavorite,
    limit,
  }: GetMyCoursesInputModel): Promise<EnrolledCourseListItemModel[]> {
    const aggregation =
      this.courseEnrollments.aggregate<EnrolledCourseListItemDoc>([
        {
          $match: {
            profileId: new ObjectId(profileId),
            isFavorite: isFavorite ?? { $exists: true },
          },
        },
        {
          $limit: limit ?? 10,
        },
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "course",
          },
        },
        {
          $unwind: "$course",
        },
        {
          $lookup: {
            from: practiceCardsCollection.name,
            let: { courseEnrollmentId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$courseEnrollmentId", "$$courseEnrollmentId"],
                  },
                  due: { $lte: new Date() },
                },
              },
            ],
            as: "practiceCards",
          },
        },
        {
          $lookup: {
            from: reviewLogsCollection.name,
            let: { courseEnrollmentId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$courseEnrollmentId", "$$courseEnrollmentId"],
                  },
                  review: { $gte: this.dateTimeService.getStartOfToday() },
                  state: PracticeCardStateModel.new,
                },
              },
            ],
            as: "reviewsOfNewCards",
          },
        },
        {
          $project: {
            courseId: true,
            isFavorite: true,
            name: "$course.name",
            picture: "$course.picture",
            dueCount: { $size: "$practiceCards" },
            newCount: {
              $max: [
                {
                  $subtract: [
                    { $ifNull: ["$course.dailyNewCardsCount", 10] },
                    { $size: "$reviewsOfNewCards" },
                  ],
                },
                0,
              ],
            },
          },
        },
      ]);

    const result = await aggregation.toArray();
    return result.map((e) =>
      new EnrolledCourseListItemTransformer(e).toDomain(),
    );
  }
  async getMyCoursesPagination({
    profileId,
    isFavorite,
    page = 1,
    pageSize = 10,
  }: GetMyCoursesPaginationInputModel): Promise<
    PaginationModel<EnrolledCourseListItemModel>
  > {
    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    const aggregation = this.courseEnrollments.aggregate<
      PaginationFacet<EnrolledCourseListItemDoc>
    >([
      {
        $match: {
          profileId: new ObjectId(profileId),
          isFavorite: isFavorite ?? { $exists: true },
        },
      },
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          results: [
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: "courses",
                localField: "courseId",
                foreignField: "_id",
                as: "course",
              },
            },
            {
              $unwind: "$course",
            },
            {
              $lookup: {
                from: practiceCardsCollection.name,
                let: { courseEnrollmentId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$courseEnrollmentId", "$$courseEnrollmentId"],
                      },
                      due: { $lte: new Date() },
                    },
                  },
                ],
                as: "practiceCards",
              },
            },
            {
              $lookup: {
                from: reviewLogsCollection.name,
                let: { courseEnrollmentId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ["$courseEnrollmentId", "$$courseEnrollmentId"],
                      },
                      review: { $gte: this.dateTimeService.getStartOfToday() },
                      state: PracticeCardStateModel.new,
                    },
                  },
                ],
                as: "reviewsOfNewCards",
              },
            },
            {
              $project: {
                courseId: true,
                isFavorite: true,
                name: "$course.name",
                picture: "$course.picture",
                dueCount: { $size: "$practiceCards" },
                newCount: {
                  $max: [
                    {
                      $subtract: [
                        { $ifNull: ["$course.dailyNewCardsCount", 10] },
                        { $size: "$reviewsOfNewCards" },
                      ],
                    },
                    0,
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $unwind: "$metadata",
      },
    ]);

    const result = await aggregation.tryNext();
    if (!result) {
      return PaginationModel.empty();
    }
    return new PaginationFacetTransformer(result).toDomain((data) =>
      new EnrolledCourseListItemTransformer(data).toDomain(),
    );
  }

  async getHasCourses(input: GetHasCoursesInputModel) {
    const result = await this.courseEnrollments.findOne(
      {
        profileId: new ObjectId(input.profileId),
      },
      { projection: { _id: 1 } },
    );
    return Boolean(result);
  }

  async getDiscoverCourses({
    limit = 12,
    paginationToken,
    query,
  }: GetDiscoverCoursesInputModel): Promise<
    TokenPaginationModel<DiscoverCourseModel>
  > {
    const aggregation = this.courses.aggregate<
      WithPaginationToken<WithId<DiscoverCourseDoc>>
    >([
      ...(query
        ? [
            {
              $search: {
                index: "courses",
                compound: {
                  should: [
                    {
                      autocomplete: {
                        query,
                        path: "name",
                        fuzzy: {
                          maxEdits: 2,
                          prefixLength: 0,
                          maxExpansions: 50,
                        },
                        score: { boost: { value: 3 } },
                      },
                    },
                    {
                      autocomplete: {
                        query,
                        path: "description",
                        fuzzy: {
                          maxEdits: 2,
                          prefixLength: 0,
                          maxExpansions: 50,
                        },
                      },
                    },
                    {
                      text: {
                        query,
                        path: "tags",
                        fuzzy: {
                          maxEdits: 2,
                          prefixLength: 0,
                          maxExpansions: 50,
                        },
                      },
                    },
                  ],
                  minimumShouldMatch: 1,
                },
                searchAfter: paginationToken,
              },
            },
          ]
        : [
            {
              $search: {
                index: "courses",
                exists: {
                  path: "name",
                },
                searchAfter: paginationToken,
              },
            },
          ]),
      {
        $match: {
          isPublic: true,
        },
      },
      { $limit: limit },
      {
        $project: {
          _id: true,
          name: true,
          description: true,
          picture: true,
          tags: true,
          paginationToken: { $meta: "searchSequenceToken" },
        },
      },
    ]);

    const result = await aggregation.toArray();
    return new TokenPaginationTransformer(result).toDomain((data) =>
      new DiscoverCourseTransformer(data).toDomain(),
    );
  }

  async getCoursesByAuthor({
    profileId,
    limit = 12,
    paginationToken,
  }: GetCoursesByAuthorInputModel): Promise<
    TokenPaginationModel<DiscoverCourseModel>
  > {
    const aggregation = this.courses.aggregate<
      WithPaginationToken<WithId<DiscoverCourseDoc>>
    >([
      {
        $search: {
          index: "courses",
          equals: {
            path: "isPublic",
            value: true,
          },
          searchAfter: paginationToken,
        },
      },
      {
        $lookup: {
          from: "coursePermissions",
          localField: "_id",
          foreignField: "courseId",
          as: "permission",
        },
      },
      {
        $unwind: "$permission",
      },
      {
        $match: {
          "permission.profileId": new ObjectId(profileId),
          "permission.permissionType": {
            $in: [
              CoursePermissionTypeModel.Own,
              CoursePermissionTypeModel.Edit,
            ],
          },
        },
      },
      { $limit: limit },
      {
        $project: {
          _id: true,
          name: true,
          description: true,
          picture: true,
          tags: true,
          paginationToken: { $meta: "searchSequenceToken" },
        },
      },
    ]);

    const result = await aggregation.toArray();
    return new TokenPaginationTransformer(result).toDomain((data) =>
      new DiscoverCourseTransformer(data).toDomain(),
    );
  }
}
