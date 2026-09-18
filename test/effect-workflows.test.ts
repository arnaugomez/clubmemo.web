import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Result from "effect/Result";
import { describe, expect, it } from "vitest";
import { IncorrectPasswordError } from "@/src/auth/domain/errors/auth-errors";
import { AuthService } from "@/src/auth/domain/interfaces/auth-service";
import { EmailVerificationCodesRepository } from "@/src/auth/domain/interfaces/email-verification-codes-repository";
import { EmailVerificationCodeModel } from "@/src/auth/domain/models/email-verification-code-model";
import { LoginWithPasswordUseCase } from "@/src/auth/domain/use-cases/login-with-password-use-case";
import { SignupUseCase } from "@/src/auth/domain/use-cases/signup-use-case";
import { CookieService } from "@/src/common/domain/interfaces/cookie-service";
import { EmailService } from "@/src/common/domain/interfaces/email-service";
import { IpService } from "@/src/common/domain/interfaces/ip-service";
import { ExternalServiceError } from "@/src/common/effect/errors";
import { ProfilesRepository } from "@/src/profile/domain/interfaces/profiles-repository";
import { RateLimitsRepository } from "@/src/rate-limits/domain/interfaces/rate-limits-repository";

// Partial doubles fail loudly if a workflow acquires an unexpected capability.
function service<A>(implementation: Partial<A>): A {
  return new Proxy(implementation, {
    get(target, key) {
      if (!(key in target))
        throw new Error(`Unexpected service operation: ${String(key)}`);
      return Reflect.get(target, key);
    },
  }) as A;
}

function dependencies(
  events: string[],
  authFailure?: IncorrectPasswordError | ExternalServiceError,
) {
  const step = <A>(name: string, value: A) =>
    Effect.sync(() => {
      events.push(name);
      return value;
    });
  const credentials = {
    userId: "user",
    sessionCookie: {
      name: "session",
      value: "token",
      attributes: {},
      serialize: () => "session=token",
    },
  };
  return Layer.mergeAll(
    Layer.succeed(IpService, { getIp: () => step("ip", "127.0.0.1") }),
    Layer.succeed(
      RateLimitsRepository,
      service<RateLimitsRepository>({
        check: () => step("check", undefined),
        increment: () => step("increment", undefined),
      }),
    ),
    Layer.succeed(
      AuthService,
      service<AuthService>({
        signupWithPassword: () => step("signup", credentials),
        loginWithPassword: () =>
          authFailure ? Effect.fail(authFailure) : step("login", credentials),
      }),
    ),
    Layer.succeed(
      ProfilesRepository,
      service<ProfilesRepository>({
        create: () => step("profile", undefined),
        getByUserId: () => step("find-profile", null),
      }),
    ),
    Layer.succeed(
      EmailVerificationCodesRepository,
      service<EmailVerificationCodesRepository>({
        generate: () =>
          step(
            "code",
            new EmailVerificationCodeModel({
              userId: "user",
              code: "123456",
              expiresAt: new Date(2100, 0, 1),
            }),
          ),
      }),
    ),
    Layer.succeed(
      EmailService,
      service<EmailService>({
        sendVerificationCode: () => step("email", undefined),
      }),
    ),
    Layer.succeed(
      CookieService,
      service<CookieService>({ set: () => step("cookie", undefined) }),
    ),
  );
}

const input = {
  email: "test@example.com",
  password: "Password-123",
  acceptTerms: true,
};
describe("Effect service workflows", () => {
  it("does no work before execution and preserves signup write ordering", async () => {
    const events: string[] = [];
    const program = Effect.gen(function* () {
      const signup = yield* SignupUseCase;
      yield* signup.execute(input);
    }).pipe(
      Effect.provide(
        Layer.effect(SignupUseCase, SignupUseCase.make).pipe(
          Layer.provide(dependencies(events)),
        ),
      ),
    );
    expect(events).toEqual([]);
    await Effect.runPromise(program);
    expect(events).toEqual([
      "ip",
      "check",
      "signup",
      "profile",
      "code",
      "email",
      "increment",
      "cookie",
    ]);
  });
  it("rejects unaccepted terms before any external operation", async () => {
    const events: string[] = [];
    const result = await Effect.runPromise(
      Effect.gen(function* () {
        const signup = yield* SignupUseCase.make;
        return yield* signup.execute({ ...input, acceptTerms: false });
      }).pipe(Effect.provide(dependencies(events)), Effect.result),
    );
    expect(Result.isFailure(result) && result.failure._tag).toBe(
      "UserDoesNotAcceptTermsError",
    );
    expect(events).toEqual([]);
  });
  it.each([
    [new IncorrectPasswordError(), ["ip", "check", "increment"]],
    [
      new ExternalServiceError({
        operation: "auth",
        cause: new Error("unavailable"),
      }),
      ["ip", "check"],
    ],
  ] as const)("only counts incorrect credentials as login failures (%s)", async (failure, expected) => {
    const events: string[] = [];
    const result = await Effect.runPromise(
      Effect.gen(function* () {
        const login = yield* LoginWithPasswordUseCase.make;
        yield* login.execute(input);
      }).pipe(Effect.provide(dependencies(events, failure)), Effect.result),
    );
    expect(Result.isFailure(result) && result.failure).toBe(failure);
    expect(events).toEqual(expected);
  });
  it("creates a missing profile before publishing the login cookie", async () => {
    const events: string[] = [];
    await Effect.runPromise(
      Effect.gen(function* () {
        const login = yield* LoginWithPasswordUseCase.make;
        yield* login.execute(input);
      }).pipe(Effect.provide(dependencies(events))),
    );
    expect(events).toEqual([
      "ip",
      "check",
      "login",
      "find-profile",
      "profile",
      "cookie",
    ]);
  });
});
