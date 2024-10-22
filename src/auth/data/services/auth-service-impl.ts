import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import type { EnvService } from "@/src/common/domain/interfaces/env-service";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import type {
  Cookie,
  PasswordHashingAlgorithm,
  RegisteredDatabaseUserAttributes,
} from "lucia";
import { Lucia } from "lucia";
import type { Collection, WithId } from "mongodb";
import { ObjectId } from "mongodb";
import { Argon2id } from "oslo/password";
import {
  IncorrectPasswordError,
  UserAlreadyExistsError,
  UserDoesNotExistError,
} from "../../domain/errors/auth-errors";
import type {
  AuthService,
  CheckPasswordInputModel,
  LoginWithPasswordInputModel,
  LoginWithPasswordResultModel,
  SignupWithPasswordInputModel,
  SignupWithPasswordResultModel,
  UpdatePasswordInputModel,
} from "../../domain/interfaces/auth-service";
import { AuthTypeModel } from "../../domain/models/auth-type-model";
import type { CheckSessionModel } from "../../domain/models/check-session-model";
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

  async validateSession(sessionId: string): Promise<CheckSessionModel> {
    const result = await this.lucia.validateSession(sessionId);
    if (!result.session) return result;
    return {
      user: new LuciaUserTransformer(result.user).toDomain(),
      session: new SessionTransformer(result.session).toDomain(),
    };
  }

  getSessionCookieName(): string {
    return this.lucia.sessionCookieName;
  }

  createSessionCookie(sessionId: string) {
    return this.lucia.createSessionCookie(sessionId);
  }

  createBlankSessionCookie() {
    return this.lucia.createBlankSessionCookie();
  }

  async invalidateSession(sessionId: string): Promise<void> {
    await this.lucia.invalidateSession(sessionId);
  }

  async invalidateUserSessions(userId: string): Promise<void> {
    await this.lucia.invalidateUserSessions(new ObjectId(userId));
  }

  async loginWithPassword({
    email,
    password,
  }: LoginWithPasswordInputModel): Promise<LoginWithPasswordResultModel> {
    const user = await this.users.findOne({
      email,
    });

    if (!user) {
      throw new UserDoesNotExistError();
    }

    const passwordIsCorrect = await this.passwordHashingAlgorithm.verify(
      user.hashed_password,
      password,
    );
    if (!passwordIsCorrect) {
      throw new IncorrectPasswordError();
    }

    const session = await this.lucia.createSession(user._id, {});
    return {
      userId: user._id.toString(),
      sessionCookie: this.lucia.createSessionCookie(session.id),
    };
  }

  async signupWithPassword({
    email,
    password,
    acceptTerms,
  }: SignupWithPasswordInputModel): Promise<SignupWithPasswordResultModel> {
    const existingUser = await this.users.findOne({
      email,
    });
    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    const hashed_password = await this.passwordHashingAlgorithm.hash(password);
    const result = await this.users.insertOne({
      email,
      hashed_password,
      acceptTerms,
      authTypes: [AuthTypeModel.email],
      isAdmin: email === this.envService.adminEmail,
    });
    const userId = result.insertedId;

    const session = await this.lucia.createSession(userId, {});
    const sessionCookie = this.lucia.createSessionCookie(session.id);
    return {
      userId: userId.toString(),
      sessionCookie,
    };
  }

  async verifyEmail(userId: string): Promise<Cookie> {
    const _id = new ObjectId(userId);
    await this.users.findOneAndUpdate(
      { _id },
      { $set: { isEmailVerified: true } },
    );

    return this.resetSessions(userId);
  }

  async updatePassword({
    userId,
    password,
  }: UpdatePasswordInputModel): Promise<void> {
    const hashed_password = await this.passwordHashingAlgorithm.hash(password);
    await this.users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { hashed_password } },
    );
  }

  async checkPasswordIsCorrect(input: CheckPasswordInputModel): Promise<void> {
    const existingUser = await this.users.findOne({
      _id: new ObjectId(input.userId),
    });
    if (!existingUser) {
      throw new UserDoesNotExistError();
    }

    const passwordIsCorrect = await this.passwordHashingAlgorithm.verify(
      existingUser.hashed_password,
      input.password,
    );
    if (!passwordIsCorrect) {
      throw new IncorrectPasswordError();
    }
  }

  async resetSessions(userId: string): Promise<Cookie> {
    const _id = new ObjectId(userId);
    await this.lucia.invalidateUserSessions(_id);
    const session = await this.lucia.createSession(_id, {});
    return this.lucia.createSessionCookie(session.id);
  }

  private get passwordHashingAlgorithm(): PasswordHashingAlgorithm {
    const secret = new TextEncoder().encode(this.envService.passwordPepper);
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
