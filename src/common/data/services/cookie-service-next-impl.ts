import { cookies } from "next/headers";
import type {
  CookieService,
  SetCookieInputModel,
} from "../../domain/interfaces/cookie-service";

/**
 * Implementation of `CookieService` using the Next `cookies` function.
 */
export class CookieServiceNextImpl implements CookieService {
  get(name: string) {
    return cookies().get(name)?.value;
  }
  set(input: SetCookieInputModel) {
    cookies().set(input.name, input.value, input.attributes);
  }
}
