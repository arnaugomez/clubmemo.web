import type { EnvService } from "@/src/common/domain/interfaces/env-service";
import type { MongoService } from "@/src/common/domain/interfaces/mongo-service";
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
  isEmailVerified?: boolean;
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

  private readonly usersCollection: typeof usersCollection.type;

  constructor(
    private readonly envService: EnvService,
    mongoService: MongoService,
  ) {
    this.usersCollection = mongoService.collection(usersCollection);

    const adapter = new MongodbAdapter(
      mongoService.collection(sessionsCollection) as unknown as Collection<
        SessionDoc & { _id: string }
      >,
      this.usersCollection as unknown as Collection<WithId<UserDoc>>,
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
  }: LoginWithPasswordInputModel): Promise<Cookie> {
    const existingUser = await this.usersCollection.findOne({
      email,
    });

    if (!existingUser) {
      throw new UserDoesNotExistError();
    }

    const passwordIsCorrect = await this.passwordHashingAlgorithm.verify(
      existingUser.hashed_password,
      password,
    );
    if (!passwordIsCorrect) {
      throw new IncorrectPasswordError();
    }

    const session = await this.lucia.createSession(existingUser._id, {});
    return this.lucia.createSessionCookie(session.id);
  }
  async signupWithPassword(
    input: SignupWithPasswordInputModel,
  ): Promise<SignupWithPasswordResultModel> {
    const { email, password } = input;
    const existingUser = await this.usersCollection.findOne({
      email,
    });
    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    const hashed_password = await this.passwordHashingAlgorithm.hash(password);
    const result = await this.usersCollection.insertOne({
      email,
      hashed_password,
      authTypes: [AuthTypeModel.Email],
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
    await this.usersCollection.findOneAndUpdate(
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
    await this.usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { hashed_password } },
    );
  }

  async checkPasswordIsCorrect(input: CheckPasswordInputModel): Promise<void> {
    const existingUser = await this.usersCollection.findOne({
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
