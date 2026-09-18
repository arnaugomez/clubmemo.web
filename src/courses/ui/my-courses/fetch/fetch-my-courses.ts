import * as Effect from "effect/Effect";
import { cache } from "react";
import { PaginationModel } from "@/src/common/domain/models/pagination-model";
import { runServer } from "@/src/common/effect/server-runtime";
import type { EnrolledCourseListItemModel } from "@/src/courses/domain/models/enrolled-course-list-item-model";
import { CoursesRepository } from "@/src/courses/layers/layer_courses-repository";
import { fetchMyProfile } from "../../../../profile/ui/fetch/fetch-my-profile";

export interface FetchMyCoursesPaginationModel {
  page: number;
}

export const fetchMyCoursesPagination = cache(
  async ({
    page,
  }: FetchMyCoursesPaginationModel): Promise<
    PaginationModel<EnrolledCourseListItemModel>
  > => {
    return runServer(
      Effect.gen(function* () {
        const profile = yield* Effect.tryPromise({
          try: () => fetchMyProfile(),
          catch: (error) => error,
        });
        if (!profile) return PaginationModel.empty();
        const coursesRepository = yield* CoursesRepository;
        return yield* coursesRepository.getMyCoursesPagination({
          profileId: profile.id,
          page,
        });
      }),
    );
  },
);
