import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import type {
  PasswordHashingAlgorithm,
  RegisteredDatabaseUserAttributes,
} from "lucia";
import { Lucia } from "lucia";
import type { Collection, WithId } from "mongodb";
import { ObjectId } from "mongodb";
import { Argon2id } from "oslo/password";
import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import type { EnvService } from "@/src/common/domain/interfaces/env-service";
import { ExternalServiceError } from "@/src/common/effect/errors";
import {
  IncorrectPasswordError,
  UserAlreadyExistsError,
  UserDoesNotExistError,
} from "../../domain/errors/auth-errors";
import type {
  AuthService,
  CheckPasswordInputModel,
  LoginWithPasswordInputModel,
  SignupWithPasswordInputModel,
  UpdatePasswordInputModel,
} from "../../domain/interfaces/auth-service";
import { AuthTypeModel } from "../../domain/models/auth-type-model";
import type { SessionDoc } from "../collections/sessions-collection";
import {
  SessionTransformer,
  sessionsCollection,
} from "../collections/sessions-collection";
import type { UserDoc } from "../collections/users-collection";
import {
  LuciaUserTransformer,
  usersCollection,
} from "../collections/users-collection";

interface DatabaseUserAttributes {
  email: string;
  hashed_password: string;
  authTypes: AuthTypeModel[];
  acceptTerms: boolean;
  isEmailVerified?: boolean;
  isAdmin?: boolean;
}

type MyLucia = Lucia<
  Record<never, never>,
  Omit<DatabaseUserAttributes, "hashed_password">
>;

/**
 * Implementation of `AuthService` with the Lucia authentication library and the
 * MongoDB database
 */
export class AuthServiceImpl implements AuthService {
  private readonly lucia: MyLucia;

  private readonly users: typeof usersCollection.type;

  constructor(
    private readonly envService: EnvService,
    databaseService: DatabaseService,
  ) {
    this.users = databaseService.collection(usersCollection);

    const adapter = new MongodbAdapter(
      databaseService.collection(sessionsCollection) as unknown as Collection<
        SessionDoc & { _id: string }
      >,
      this.users as unknown as Collection<WithId<UserDoc>>,
    );
    this.lucia = new Lucia(adapter, {
      sessionCookie: {
        // this sets cookies with super long expiration
        // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
        expires: false,
        attributes: {
          // set to `true` when using HTTPS
          secure: process.env.NODE_ENV === "production",
        },
      },
      getUserAttributes(attributes: RegisteredDatabaseUserAttributes) {
        return {
          email: attributes.email,
          authTypes: attributes.authTypes,
          isEmailVerified: attributes.isEmailVerified,
          isAdmin: attributes.isAdmin,
        };
      },
    });
  }

  validateSession = Effect.fn("AuthServiceImpl.validateSession")(function* (
    this: AuthServiceImpl,
    sessionId: string,
  ) {
    const result = yield* Effect.tryPromise({
      try: () => this.lucia.validateSession(sessionId),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "AuthServiceImpl.validateSession",
          cause,
        }),
    });
    if (!result.session) return result;
    return {
      user: new LuciaUserTransformer(result.user).toDomain(),
      session: new SessionTransformer(result.session).toDomain(),
    };
  }).bind(this);

  getSessionCookieName(): string {
    return this.lucia.sessionCookieName;
  }

  createSessionCookie(sessionId: string) {
    return this.lucia.createSessionCookie(sessionId);
  }

  createBlankSessionCookie() {
    return this.lucia.createBlankSessionCookie();
  }

  invalidateSession = Effect.fn("AuthServiceImpl.invalidateSession")(function* (
    this: AuthServiceImpl,
    sessionId: string,
  ) {
    yield* Effect.tryPromise({
      try: () => this.lucia.invalidateSession(sessionId),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "AuthServiceImpl.invalidateSession",
          cause,
        }),
    });
  }).bind(this);

  invalidateUserSessions = Effect.fn("AuthServiceImpl.invalidateUserSessions")(
    function* (this: AuthServiceImpl, userId: string) {
      yield* Effect.tryPromise({
        try: () => this.lucia.invalidateUserSessions(new ObjectId(userId)),
        catch: (cause) =>
          new ExternalServiceError({
            operation: "AuthServiceImpl.invalidateUserSessions",
            cause,
          }),
      });
    },
  ).bind(this);

  loginWithPassword = Effect.fn("AuthServiceImpl.loginWithPassword")(function* (
    this: AuthServiceImpl,
    { email, password }: LoginWithPasswordInputModel,
  ) {
    const user = yield* Effect.tryPromise({
      try: () =>
        this.users.findOne({
          email,
        }),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "AuthServiceImpl.loginWithPassword",
          cause,
        }),
    });

    if (!user) {
      return yield* Effect.fail(new UserDoesNotExistError());
    }

    const passwordIsCorrect = yield* Effect.tryPromise({
      try: () =>
        this.passwordHashingAlgorithm.verify(user.hashed_password, password),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "AuthServiceImpl.loginWithPassword",
          cause,
        }),
    });
    if (!passwordIsCorrect) {
      return yield* Effect.fail(new IncorrectPasswordError());
    }

    const session = yield* Effect.tryPromise({
      try: () => this.lucia.createSession(user._id, {}),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "AuthServiceImpl.loginWithPassword",
          cause,
        }),
    });
    return {
      userId: user._id.toString(),
      sessionCookie: this.lucia.createSessionCookie(session.id),
    };
  }).bind(this);

  signupWithPassword = Effect.fn("AuthServiceImpl.signupWithPassword")(
    function* (
      this: AuthServiceImpl,
      { email, password, acceptTerms }: SignupWithPasswordInputModel,
    ) {
      const existingUser = yield* Effect.tryPromise({
        try: () =>
          this.users.findOne({
            email,
          }),
        catch: (cause) =>
          new ExternalServiceError({
            operation: "AuthServiceImpl.signupWithPassword",
            cause,
          }),
      });
      if (existingUser) {
        return yield* Effect.fail(new UserAlreadyExistsError());
      }

      const hashed_password = yield* Effect.tryPromise({
        try: () => this.passwordHashingAlgorithm.hash(password),
        catch: (cause) =>
          new ExternalServiceError({
            operation: "AuthServiceImpl.signupWithPassword",
            cause,
          }),
      });
      const result = yield* Effect.tryPromise({
        try: () =>
          this.users.insertOne({
            email,
            hashed_password,
            acceptTerms,
            authTypes: [AuthTypeModel.email],
            isAdmin: email === this.envService.adminEmail,
          }),
        catch: (cause) =>
          new ExternalServiceError({
            operation: "AuthServiceImpl.signupWithPassword",
            cause,
          }),
      });
      const userId = result.insertedId;

      const session = yield* Effect.tryPromise({
        try: () => this.lucia.createSession(userId, {}),
        catch: (cause) =>
          new ExternalServiceError({
            operation: "AuthServiceImpl.signupWithPassword",
            cause,
          }),
      });
      const sessionCookie = this.lucia.createSessionCookie(session.id);
      return {
        userId: userId.toString(),
        sessionCookie,
      };
    },
  ).bind(this);

  verifyEmail = Effect.fn("AuthServiceImpl.verifyEmail")(function* (
    this: AuthServiceImpl,
    userId: string,
  ) {
    const _id = new ObjectId(userId);
    yield* Effect.tryPromise({
      try: () =>
        this.users.findOneAndUpdate(
          { _id },
          { $set: { isEmailVerified: true } },
        ),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "AuthServiceImpl.verifyEmail",
          cause,
        }),
    });

    return yield* this.resetSessions(userId);
  }).bind(this);

  updatePassword = Effect.fn("AuthServiceImpl.updatePassword")(function* (
    this: AuthServiceImpl,
    { userId, password }: UpdatePasswordInputModel,
  ) {
    const hashed_password = yield* Effect.tryPromise({
      try: () => this.passwordHashingAlgorithm.hash(password),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "AuthServiceImpl.updatePassword",
          cause,
        }),
    });
    yield* Effect.tryPromise({
      try: () =>
        this.users.updateOne(
          { _id: new ObjectId(userId) },
          { $set: { hashed_password } },
        ),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "AuthServiceImpl.updatePassword",
          cause,
        }),
    });
  }).bind(this);

  checkPasswordIsCorrect = Effect.fn("AuthServiceImpl.checkPasswordIsCorrect")(
    function* (this: AuthServiceImpl, input: CheckPasswordInputModel) {
      const existingUser = yield* Effect.tryPromise({
        try: () =>
          this.users.findOne({
            _id: new ObjectId(input.userId),
          }),
        catch: (cause) =>
          new ExternalServiceError({
            operation: "AuthServiceImpl.checkPasswordIsCorrect",
            cause,
          }),
      });
      if (!existingUser) {
        return yield* Effect.fail(new UserDoesNotExistError());
      }

      const passwordIsCorrect = yield* Effect.tryPromise({
        try: () =>
          this.passwordHashingAlgorithm.verify(
            existingUser.hashed_password,
            input.password,
          ),
        catch: (cause) =>
          new ExternalServiceError({
            operation: "AuthServiceImpl.checkPasswordIsCorrect",
            cause,
          }),
      });
      if (!passwordIsCorrect) {
        return yield* Effect.fail(new IncorrectPasswordError());
      }
    },
  ).bind(this);

  resetSessions = Effect.fn("AuthServiceImpl.resetSessions")(function* (
    this: AuthServiceImpl,
    userId: string,
  ) {
    const _id = new ObjectId(userId);
    yield* Effect.tryPromise({
      try: () => this.lucia.invalidateUserSessions(_id),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "AuthServiceImpl.resetSessions",
          cause,
        }),
    });
    const session = yield* Effect.tryPromise({
      try: () => this.lucia.createSession(_id, {}),
      catch: (cause) =>
        new ExternalServiceError({
          operation: "AuthServiceImpl.resetSessions",
          cause,
        }),
    });
    return this.lucia.createSessionCookie(session.id);
  }).bind(this);

  private get passwordHashingAlgorithm(): PasswordHashingAlgorithm {
    const secret = new TextEncoder().encode(
      Redacted.value(this.envService.passwordPepper),
    );
    return new Argon2id({ secret });
  }
}

declare module "lucia" {
  interface Register {
    Lucia: MyLucia;
    UserId: ObjectId;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
