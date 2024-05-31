/**
 * Service to manage cookies. Intended to work in the server runtime, and be
 * called within server components or server actions. Once called, the cookies
 * are set in the response headers and sent to the client.
 */
export interface CookieService {
  /**
   * Gets the value of a cookie by its name.
   *
   * @param name The name of the cookie to get
   * @returns The value of the cookie if it exists, `undefined` otherwise
   */
  get(name: string): string | undefined;
  /**
   * Sets the value of a cookie.
   *
   * @param input The data to set a cookie: name, value and attributes such as the expiraton date.
   */
  set(input: SetCookieInputModel): void;
}

export interface SetCookieInputModel {
  name: string;
  value: string;
  attributes: CookieAttributesModel;
}

interface CookieAttributesModel {
  secure?: boolean;
  path?: string;
  domain?: string;
  sameSite?: "lax" | "strict" | "none";
  httpOnly?: boolean;
  maxAge?: number;
  expires?: Date;
}
