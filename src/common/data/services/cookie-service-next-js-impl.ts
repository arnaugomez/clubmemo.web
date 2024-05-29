import { cookies } from "next/headers";
import type {
  SetCookieInputModel,
  CookieService,
} from "../../domain/interfaces/cookie-service";

export class CookieServiceNextJsImpl implements CookieService {
  get(name: string) {
    return cookies().get(name)?.value;
  }
  set(input: SetCookieInputModel) {
    cookies().set(input.name, input.value, input.attributes);
  }
}
