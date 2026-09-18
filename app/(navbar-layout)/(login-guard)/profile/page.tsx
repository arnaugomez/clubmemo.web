import * as Effect from "effect/Effect";
import { notFound, RedirectType, redirect } from "next/navigation";
import { fetchSession } from "@/src/auth/ui/fetch/fetch-session";
import { runServer } from "@/src/common/effect/server-runtime";
import { ProfilesRepository } from "@/src/profile/layers/layer_profiles-repository";
import { getProfilePagePath } from "@/src/profile/ui/utils/get-profile-page-path";

/**
 * Route that redirects to the page of the profile of the current user
 */
export default async function MyProfilePage() {
  return runServer(
    Effect.gen(function* () {
      const { user } = yield* Effect.tryPromise({
        try: () => fetchSession(),
        catch: (error) => error,
      });
      if (!user) notFound();

      const profilesRepository = yield* ProfilesRepository;
      const profile = yield* profilesRepository.getByUserId(user.id);
      if (!profile) notFound();
      redirect(getProfilePagePath(profile), RedirectType.replace);
    }),
  );
}
