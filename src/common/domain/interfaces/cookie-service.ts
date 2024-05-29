export interface CookieService {
  get(name: string): string | undefined;
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
