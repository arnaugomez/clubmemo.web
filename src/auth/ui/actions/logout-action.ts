"use server";
import * as Effect from "effect/Effect";
import { redirect } from "next/navigation";
import { LogoutUseCaseService } from "@/src/auth/layers/layer_logout-use-case";
import { runServer } from "@/src/common/effect/server-runtime";

/**
 * Logs out the user and redirects to the landing page
 */
export async function logoutAction() {
  return runServer(
    Effect.gen(function* () {
      const useCase = yield* LogoutUseCaseService;
      yield* useCase.execute();

      redirect("/");
    }),
  );
}
