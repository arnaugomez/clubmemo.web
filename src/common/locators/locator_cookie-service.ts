import { CookieServiceNextImpl } from "../data/services/cookie-service-next-impl";
import type { Dependency } from "../di/locator-types";
import { singleton } from "../di/locator-utils";
import type { CookieService } from "../domain/interfaces/cookie-service";

export const locator_common_CookieService: Dependency<CookieService> =
  singleton(() => new CookieServiceNextImpl());
