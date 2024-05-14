import type { PaginationFacet } from "@/src/common/data/facets/pagination-facet";
import { PaginationFacetTransformer } from "@/src/common/data/facets/pagination-facet";
import type { DateTimeService } from "@/src/common/domain/interfaces/date-time-service";
import type { MongoService } from "@/src/common/domain/interfaces/mongo-service";
import { PaginationModel } from "@/src/common/domain/models/pagination-model";
import type { TokenPaginationModel } from "@/src/common/domain/models/token-pagination-model";
import { practiceCardsCollection } from "@/src/practice/data/collections/practice-cards-collection";
import { reviewLogsCollection } from "@/src/practice/data/collections/review-logs-collection";
import { PracticeCardStateModel } from "@/src/practice/domain/models/practice-card-state-model";
import type { WithId } from "mongodb";
import { ObjectId } from "mongodb";
import type {
  CoursesRepository,
  GetCoursesByAuthorInputModel,
  GetDiscoverCoursesInputModel,
  GetHasCoursesInputModel,
  GetInterestingCoursesInputModel,
  GetMyCoursesInputModel,
  GetMyCoursesPaginationInputModel,
} from "../../domain/interfaces/courses-repository";
import type { CourseModel } from "../../domain/models/course-model";
import { CoursePermissionTypeModel } from "../../domain/models/course-permission-type-model";
import type { CreateCourseInputModel } from "../../domain/models/create-course-input-model";
import type { DiscoverCourseModel } from "../../domain/models/discover-course-model";
import type { EnrolledCourseListItemModel } from "../../domain/models/enrolled-course-list-item-model";
import type { GetCourseDetailInputModel } from "../../domain/models/get-course-detail-input-model";
import type { KeepLearningModel } from "../../domain/models/keep-learning-model";
import type { UpdateCourseInputModel } from "../../domain/models/update-course-input-model";
import type { DiscoverCourseDoc } from "../aggregations/discover-course-aggregation";
import { DiscoverCourseTransformer } from "../aggregations/discover-course-aggregation";
import type { EnrolledCourseListItemDoc } from "../aggregations/enrolled-course-list-item-aggregation";
import { EnrolledCourseListItemTransformer } from "../aggregations/enrolled-course-list-item-aggregation";
import type { KeepLearningAggregationDoc } from "../aggregations/keep-learning-aggregation";
import { KeepLearningAggregationDocTransformer } from "../aggregations/keep-learning-aggregation";
import type { CourseEnrollmentDoc } from "../collections/course-enrollments-collection";
import { courseEnrollmentsCollection } from "../collections/course-enrollments-collection";
import { coursePermissionsCollection } from "../collections/course-permissions-collection";
import type { CourseDoc } from "../collections/courses-collection";
import {
  CourseDocTransformer,
  coursesCollection,
} from "../collections/courses-collection";
import type { WithPaginationToken } from "../models/with-pagination-token";
import { TokenPaginationTransformer } from "../models/with-pagination-token";

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
                  due: { $lte: this.dateTimeService.getStartOfTomorrow() },
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
            _id: false,
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
                      due: { $lte: this.dateTimeService.getStartOfTomorrow() },
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
                _id: false,
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

  async getKeepLearning(profileId: string): Promise<KeepLearningModel | null> {
    const aggregation =
      this.courseEnrollments.aggregate<KeepLearningAggregationDoc>([
        {
          $match: {
            profileId: new ObjectId(profileId),
          },
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
                  due: { $lte: this.dateTimeService.getStartOfTomorrow() },
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
            tags: "$course.tags",
            description: "$course.description",
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
        {
          $match: {
            $or: [{ dueCount: { $gt: 0 } }, { newCount: { $gt: 0 } }],
          },
        },
        {
          $sort: {
            isFavorite: -1,
            dueCount: -1,
            newCount: -1,
          },
        },
        {
          $limit: 1,
        },
      ]);

    const result = await aggregation.next();
    return (
      result && new KeepLearningAggregationDocTransformer(result).toDomain()
    );
  }

  async getInterestingCourses(
    input: GetInterestingCoursesInputModel,
  ): Promise<DiscoverCourseModel[]> {
    const cursor = this.courses.aggregate<WithId<DiscoverCourseDoc>>([
      {
        $match: {
          isPublic: true,
          tags: { $in: input.tags },
        },
      },
      {
        $lookup: {
          from: courseEnrollmentsCollection.name,
          let: { courseId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$courseId", "$$courseId"],
                },
                profileId: new ObjectId(input.profileId),
              },
            },
          ],
          as: "courseEnrollments",
        },
      },
      {
        $match: {
          courseEnrollments: { $size: 0 },
        },
      },
      {
        $sample: {
          size: 3,
        },
      },
      {
        $project: {
          name: true,
          description: true,
          picture: true,
          tags: true,
        },
      },
    ]);

    const result = await cursor.toArray();
    return result.map((data) => new DiscoverCourseTransformer(data).toDomain());
  }
}
