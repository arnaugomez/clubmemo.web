import { cookies } from "next/headers";
import { cache } from "react";

import { locator } from "../../../common/locator";
import {
  CheckSessionModel,
  emptyCheckSession,
} from "../../domain/models/check-session-model";

export const fetchSession = cache(async (): Promise<CheckSessionModel> => {
  const authService = locator.AuthService();
  const sessionId =
    cookies().get(authService.getSessionCookieName())?.value ?? null;
  if (!sessionId) return emptyCheckSession;

  const result = await authService.validateSession(sessionId);

  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = authService.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!result.session) {
      const sessionCookie = authService.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {}
  return result;
});
