import { cookies } from "next/headers";
import type {
  CookieService,
  SetCookieInputModel,
} from "../../domain/interfaces/cookie-service";

/**
 * Implementation of `CookieService` using the Next `cookies` function.
 */
export class CookieServiceNextImpl implements CookieService {
  async get(name: string) {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value;
  }
  async set(input: SetCookieInputModel) {
    const cookieStore = await cookies();
    cookieStore.set(input.name, input.value, input.attributes);
  }
}
