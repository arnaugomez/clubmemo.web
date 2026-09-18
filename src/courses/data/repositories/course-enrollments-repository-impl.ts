import * as Effect from "effect/Effect";
import { ObjectId } from "mongodb";
import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ExternalServiceError } from "@/src/common/effect/errors";
import type {
  CourseEnrollmentsRepository,
  CreateCourseEnrollmentInputModel,
  DeleteCourseEnrollmentInputModel,
  SetCourseFavoriteInputModel,
  UpdateCourseEnrollmentConfigInputModel,
} from "../../domain/interfaces/course-enrollments-repository";
import {
  CourseEnrollmentDocTransformer,
  courseEnrollmentsCollection,
} from "../collections/course-enrollments-collection";

export class CourseEnrollmentsRepositoryImpl
  implements CourseEnrollmentsRepository
{
  private readonly collection: typeof courseEnrollmentsCollection.type;

  constructor(databaseService: DatabaseService) {
    this.collection = databaseService.collection(courseEnrollmentsCollection);
  }

  create = Effect.fn("CourseEnrollmentsRepositoryImpl.create")(function* (
    this: CourseEnrollmentsRepositoryImpl,
    input: CreateCourseEnrollmentInputModel,
  ) {
    yield* Effect.tryPromise({
      try: () =>
        this.collection.insertOne({
          courseId: new ObjectId(input.courseId),
          profileId: new ObjectId(input.profileId),
          isFavorite: false,
        }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "CourseEnrollmentsRepositoryImpl.create",
          cause,
        }),
    });
  }).bind(this);

  get = Effect.fn("CourseEnrollmentsRepositoryImpl.get")(function* (
    this: CourseEnrollmentsRepositoryImpl,
    id: string,
  ) {
    const result = yield* Effect.tryPromise({
      try: () => this.collection.findOne({ _id: new ObjectId(id) }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "CourseEnrollmentsRepositoryImpl.get",
          cause,
        }),
    });
    return result && new CourseEnrollmentDocTransformer(result).toDomain();
  }).bind(this);

  setFavorite = Effect.fn("CourseEnrollmentsRepositoryImpl.setFavorite")(
    function* (
      this: CourseEnrollmentsRepositoryImpl,
      input: SetCourseFavoriteInputModel,
    ) {
      yield* Effect.tryPromise({
        try: () =>
          this.collection.updateOne(
            {
              courseId: new ObjectId(input.courseId),
              profileId: new ObjectId(input.profileId),
            },
            {
              $set: { isFavorite: input.isFavorite },
            },
          ),
        catch: (cause) =>
          new ExternalServiceError({
            operation: "CourseEnrollmentsRepositoryImpl.setFavorite",
            cause,
          }),
      });
    },
  ).bind(this);

  delete = Effect.fn("CourseEnrollmentsRepositoryImpl.delete")(function* (
    this: CourseEnrollmentsRepositoryImpl,
    input: DeleteCourseEnrollmentInputModel,
  ) {
    yield* Effect.tryPromise({
      try: () =>
        this.collection.deleteOne({
          courseId: new ObjectId(input.courseId),
          profileId: new ObjectId(input.profileId),
        }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "CourseEnrollmentsRepositoryImpl.delete",
          cause,
        }),
    });
  }).bind(this);

  deleteByCourseId = Effect.fn(
    "CourseEnrollmentsRepositoryImpl.deleteByCourseId",
  )(function* (this: CourseEnrollmentsRepositoryImpl, courseId: string) {
    yield* Effect.tryPromise({
      try: () =>
        this.collection.deleteMany({
          courseId: new ObjectId(courseId),
        }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "CourseEnrollmentsRepositoryImpl.deleteByCourseId",
          cause,
        }),
    });
  }).bind(this);

  updateConfig = Effect.fn("CourseEnrollmentsRepositoryImpl.updateConfig")(
    function* (
      this: CourseEnrollmentsRepositoryImpl,
      input: UpdateCourseEnrollmentConfigInputModel,
    ) {
      yield* Effect.tryPromise({
        try: () =>
          this.collection.updateOne(
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
          ),
        catch: (cause) =>
          new ExternalServiceError({
            operation: "CourseEnrollmentsRepositoryImpl.updateConfig",
            cause,
          }),
      });
    },
  ).bind(this);
}
