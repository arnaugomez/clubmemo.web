import * as Effect from "effect/Effect";
import type { WithId } from "mongodb";
import { ObjectId } from "mongodb";
import type { PaginationFacet } from "@/src/common/data/facets/pagination-facet";
import { PaginationFacetTransformer } from "@/src/common/data/facets/pagination-facet";
import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import type { DateTimeService } from "@/src/common/domain/interfaces/date-time-service";
import { PaginationModel } from "@/src/common/domain/models/pagination-model";
import { ExternalServiceError } from "@/src/common/effect/errors";
import type {
  CoursesRepository,
  GetCoursesByAuthorInputModel,
  GetDiscoverCoursesInputModel,
  GetInterestingCoursesInputModel,
  GetMyCoursesInputModel,
  GetMyCoursesPaginationInputModel,
} from "../../domain/interfaces/courses-repository";
import { CoursePermissionTypeModel } from "../../domain/models/course-permission-type-model";
import type { CreateCourseInputModel } from "../../domain/models/create-course-input-model";
import type { EnrolledCourseListItemModel } from "../../domain/models/enrolled-course-list-item-model";
import type { GetCourseDetailInputModel } from "../../domain/models/get-course-detail-input-model";
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
import { coursesByEnrollmentLookupPipelineStages } from "../pipelines/courses-by-enrollment-lookup-pipeline-stage";
import { getDueCardsLookupPipelineStage } from "../pipelines/due-cards-lookup-pipeline-stage";
import { newCardsLookupPipelineStage } from "../pipelines/new-cards-lookup-pipeline-stage";
import { newCountProjectionQuery } from "../pipelines/new-count-projection-query";
import { getReviewsOfNewCardsLookupPipelineStage } from "../pipelines/reviews-of-new-cards-lookup-pipeline-stage";

/**
 * Implementation of `CoursesRepository` with the MongoDB database
 */
export class CoursesRepositoryImpl implements CoursesRepository {
  private readonly courses: typeof coursesCollection.type;
  private readonly coursePermissions: typeof coursePermissionsCollection.type;
  private readonly courseEnrollments: typeof courseEnrollmentsCollection.type;

  constructor(
    databaseService: DatabaseService,
    private readonly dateTimeService: DateTimeService,
  ) {
    this.courses = databaseService.collection(coursesCollection);
    this.coursePermissions = databaseService.collection(
      coursePermissionsCollection,
    );
    this.courseEnrollments = databaseService.collection(
      courseEnrollmentsCollection,
    );
  }

  create = Effect.fn("CoursesRepositoryImpl.create")(function* (
    this: CoursesRepositoryImpl,
    input: CreateCourseInputModel,
  ) {
    const insertedCourse = {
      name: input.name,
      isPublic: false,
    } as WithId<CourseDoc>;
    yield* Effect.tryPromise({
      try: () => this.courses.insertOne(insertedCourse),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "CoursesRepositoryImpl.create",
          cause,
        }),
    });
    yield* Effect.tryPromise({
      try: () =>
        this.coursePermissions.insertOne({
          courseId: insertedCourse._id,
          profileId: new ObjectId(input.profileId),
          permissionType: CoursePermissionTypeModel.own,
        }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "CoursesRepositoryImpl.create",
          cause,
        }),
    });
    const insertedEnrollment = {
      courseId: insertedCourse._id,
      profileId: new ObjectId(input.profileId),
      isFavorite: false,
    } as WithId<CourseEnrollmentDoc>;
    yield* Effect.tryPromise({
      try: () => this.courseEnrollments.insertOne(insertedEnrollment),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "CoursesRepositoryImpl.create",
          cause,
        }),
    });
    return new CourseDocTransformer(insertedCourse).toDomain(
      CoursePermissionTypeModel.own,
      insertedEnrollment,
    );
  }).bind(this);

  getDetail = Effect.fn("CoursesRepositoryImpl.getDetail")(function* (
    this: CoursesRepositoryImpl,
    { id, profileId }: GetCourseDetailInputModel,
  ) {
    const courseId = new ObjectId(id);
    const [course, permission, enrollment] = yield* Effect.all(
      [
        Effect.tryPromise({
          try: () => this.courses.findOne({ _id: courseId }),
          catch: (cause) =>
            new ExternalServiceError({
              operation: "CoursesRepositoryImpl.getDetail",
              cause,
            }),
        }),
        Effect.tryPromise({
          try: () =>
            this.coursePermissions.findOne({
              courseId,
              profileId: new ObjectId(profileId),
            }),
          catch: (cause) =>
            new ExternalServiceError({
              operation: "CoursesRepositoryImpl.getDetail",
              cause,
            }),
        }),
        Effect.tryPromise({
          try: () =>
            this.courseEnrollments.findOne({
              courseId,
              profileId: new ObjectId(profileId),
            }),
          catch: (cause) =>
            new ExternalServiceError({
              operation: "CoursesRepositoryImpl.getDetail",
              cause,
            }),
        }),
      ],
      { concurrency: "unbounded" },
    );
    if (!course) return null;
    return new CourseDocTransformer(course).toDomain(
      permission?.permissionType ?? null,
      enrollment,
    );
  }).bind(this);

  update = Effect.fn("CoursesRepositoryImpl.update")(function* (
    this: CoursesRepositoryImpl,
    { id, ...input }: UpdateCourseInputModel,
  ) {
    yield* Effect.tryPromise({
      try: () =>
        this.courses.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              description: input.description,
              isPublic: input.isPublic,
              name: input.name,
              picture: input.picture,
              tags: input.tags,
            },
          },
        ),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "CoursesRepositoryImpl.update",
          cause,
        }),
    });
  }).bind(this);

  delete = Effect.fn("CoursesRepositoryImpl.delete")(function* (
    this: CoursesRepositoryImpl,
    id: string,
  ) {
    const _id = new ObjectId(id);
    yield* Effect.all(
      [
        Effect.tryPromise({
          try: () => this.courses.deleteOne({ _id }),
          catch: (cause) =>
            new ExternalServiceError({
              operation: "CoursesRepositoryImpl.delete",
              cause,
            }),
        }),
        Effect.tryPromise({
          try: () => this.coursePermissions.deleteMany({ courseId: _id }),
          catch: (cause) =>
            new ExternalServiceError({
              operation: "CoursesRepositoryImpl.delete",
              cause,
            }),
        }),
        Effect.tryPromise({
          try: () => this.courseEnrollments.deleteMany({ courseId: _id }),
          catch: (cause) =>
            new ExternalServiceError({
              operation: "CoursesRepositoryImpl.delete",
              cause,
            }),
        }),
      ],
      { concurrency: "unbounded" },
    );
  }).bind(this);

  getMyCourses = Effect.fn("CoursesRepositoryImpl.getMyCourses")(function* (
    this: CoursesRepositoryImpl,
    { profileId, isFavorite, limit }: GetMyCoursesInputModel,
  ) {
    const getStartOfToday = yield* this.dateTimeService.getStartOfToday();
    const getStartOfTomorrow = yield* this.dateTimeService.getStartOfTomorrow();
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
        ...coursesByEnrollmentLookupPipelineStages,
        getDueCardsLookupPipelineStage(getStartOfTomorrow),
        getReviewsOfNewCardsLookupPipelineStage(getStartOfToday),
        newCardsLookupPipelineStage,
        {
          $project: {
            _id: false,
            courseId: true,
            isFavorite: true,
            name: "$course.name",
            picture: "$course.picture",
            dueCount: { $size: "$dueCards" },
            newCount: newCountProjectionQuery,
          },
        },
      ]);

    const result = yield* Effect.tryPromise({
      try: () => aggregation.toArray(),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "CoursesRepositoryImpl.getMyCourses",
          cause,
        }),
    });
    return result.map((e) =>
      new EnrolledCourseListItemTransformer(e).toDomain(),
    );
  }).bind(this);
  getMyCoursesPagination = Effect.fn(
    "CoursesRepositoryImpl.getMyCoursesPagination",
  )(function* (
    this: CoursesRepositoryImpl,
    {
      profileId,
      isFavorite,
      page = 1,
      pageSize = 10,
    }: GetMyCoursesPaginationInputModel,
  ) {
    const getStartOfToday = yield* this.dateTimeService.getStartOfToday();
    const getStartOfTomorrow = yield* this.dateTimeService.getStartOfTomorrow();
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
            ...coursesByEnrollmentLookupPipelineStages,
            getDueCardsLookupPipelineStage(getStartOfTomorrow),

            getReviewsOfNewCardsLookupPipelineStage(getStartOfToday),
            newCardsLookupPipelineStage,
            {
              $project: {
                _id: false,
                courseId: true,
                isFavorite: true,
                name: "$course.name",
                picture: "$course.picture",
                dueCount: { $size: "$dueCards" },
                newCount: newCountProjectionQuery,
              },
            },
          ],
        },
      },
      {
        $unwind: "$metadata",
      },
    ]);

    const result = yield* Effect.tryPromise({
      try: () => aggregation.tryNext(),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "CoursesRepositoryImpl.getMyCoursesPagination",
          cause,
        }),
    });
    if (!result) {
      return PaginationModel.empty<EnrolledCourseListItemModel>();
    }
    return new PaginationFacetTransformer(result).toDomain((data) =>
      new EnrolledCourseListItemTransformer(data).toDomain(),
    );
  }).bind(this);

  getHasCourses = Effect.fn("CoursesRepositoryImpl.getHasCourses")(function* (
    this: CoursesRepositoryImpl,
    profileId: string,
  ) {
    const result = yield* Effect.tryPromise({
      try: () =>
        this.courseEnrollments.findOne(
          { profileId: new ObjectId(profileId) },
          { projection: { _id: 1 } },
        ),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "CoursesRepositoryImpl.getHasCourses",
          cause,
        }),
    });
    return Boolean(result);
  }).bind(this);

  getDiscoverCourses = Effect.fn("CoursesRepositoryImpl.getDiscoverCourses")(
    function* (
      this: CoursesRepositoryImpl,
      { limit = 12, paginationToken, query }: GetDiscoverCoursesInputModel,
    ) {
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

      const result = yield* Effect.tryPromise({
        try: () => aggregation.toArray(),
        catch: (cause) =>
          new ExternalServiceError({
            operation: "CoursesRepositoryImpl.getDiscoverCourses",
            cause,
          }),
      });
      return new TokenPaginationTransformer(result).toDomain((data) =>
        new DiscoverCourseTransformer(data).toDomain(),
      );
    },
  ).bind(this);

  getCoursesByAuthor = Effect.fn("CoursesRepositoryImpl.getCoursesByAuthor")(
    function* (
      this: CoursesRepositoryImpl,
      { profileId, limit = 12, paginationToken }: GetCoursesByAuthorInputModel,
    ) {
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
                CoursePermissionTypeModel.own,
                CoursePermissionTypeModel.edit,
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

      const result = yield* Effect.tryPromise({
        try: () => aggregation.toArray(),
        catch: (cause) =>
          new ExternalServiceError({
            operation: "CoursesRepositoryImpl.getCoursesByAuthor",
            cause,
          }),
      });
      return new TokenPaginationTransformer(result).toDomain((data) =>
        new DiscoverCourseTransformer(data).toDomain(),
      );
    },
  ).bind(this);

  getKeepLearning = Effect.fn("CoursesRepositoryImpl.getKeepLearning")(
    function* (this: CoursesRepositoryImpl, profileId: string) {
      const getStartOfToday = yield* this.dateTimeService.getStartOfToday();
      const getStartOfTomorrow =
        yield* this.dateTimeService.getStartOfTomorrow();
      const aggregation =
        this.courseEnrollments.aggregate<KeepLearningAggregationDoc>([
          {
            $match: {
              profileId: new ObjectId(profileId),
            },
          },
          ...coursesByEnrollmentLookupPipelineStages,
          getDueCardsLookupPipelineStage(getStartOfTomorrow),
          getReviewsOfNewCardsLookupPipelineStage(getStartOfToday),
          newCardsLookupPipelineStage,
          {
            $project: {
              courseId: true,
              isFavorite: true,
              name: "$course.name",
              picture: "$course.picture",
              tags: "$course.tags",
              description: "$course.description",
              dueCount: { $size: "$dueCards" },
              newCount: newCountProjectionQuery,
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

      const result = yield* Effect.tryPromise({
        try: () => aggregation.next(),
        catch: (cause) =>
          new ExternalServiceError({
            operation: "CoursesRepositoryImpl.getKeepLearning",
            cause,
          }),
      });
      return (
        result && new KeepLearningAggregationDocTransformer(result).toDomain()
      );
    },
  ).bind(this);

  getInterestingCourses = Effect.fn(
    "CoursesRepositoryImpl.getInterestingCourses",
  )(function* (
    this: CoursesRepositoryImpl,
    input: GetInterestingCoursesInputModel,
  ) {
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

    const result = yield* Effect.tryPromise({
      try: () => cursor.toArray(),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "CoursesRepositoryImpl.getInterestingCourses",
          cause,
        }),
    });
    return result.map((data) => new DiscoverCourseTransformer(data).toDomain());
  }).bind(this);
}
