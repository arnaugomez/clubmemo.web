import { MongoService } from "@/src/core/app/domain/interfaces/mongo-service";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { Cookie, Lucia, RegisteredDatabaseUserAttributes } from "lucia";
import { Collection, ObjectId, WithId } from "mongodb";
import { Argon2id } from "oslo/password";
import {
  IncorrectPasswordError,
  UserAlreadyExistsError,
  UserDoesNotExistError,
} from "../../domain/errors/auth-errors";
import {
  AuthService,
  LoginWithPasswordModel,
  SignupWithPasswordModel,
  SignupWithPasswordResultModel,
} from "../../domain/interfaces/auth-service";
import { AuthType } from "../../domain/models/auth-type-model";
import { CheckSessionModel } from "../../domain/models/check-session-model";
import {
  SessionDoc,
  sessionsCollection,
} from "../collections/sessions-collection";
import { UserDoc, usersCollection } from "../collections/users-collection";

interface DatabaseUserAttributes {
  email: string;
  hashed_password: string;
  authTypes: AuthType[];
  isEmailVerified?: boolean;
}

type MyLucia = Lucia<
  Record<never, never>,
  Omit<DatabaseUserAttributes, "hashed_password">
>;

export class AuthServiceImpl implements AuthService {
  private readonly lucia: MyLucia;

  private readonly usersCollection: Collection<UserDoc>;

  constructor(mongoService: MongoService) {
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
    return await this.lucia.validateSession(sessionId);
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
  async loginWithPassword({
    email,
    password,
  }: LoginWithPasswordModel): Promise<Cookie> {
    const existingUser = await this.usersCollection.findOne({
      email,
    });

    if (!existingUser) {
      throw new UserDoesNotExistError();
    }

    const passwordIsCorrect = await new Argon2id().verify(
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
    input: SignupWithPasswordModel,
  ): Promise<SignupWithPasswordResultModel> {
    const { email, password } = input;
    const hashedPassword = await new Argon2id().hash(password);
    const existingUser = await this.usersCollection.findOne({
      email,
    });
    if (existingUser) {
      throw new UserAlreadyExistsError();
    }
    const result = await this.usersCollection.insertOne({
      email,
      hashed_password: hashedPassword,
      authTypes: ["email"],
    });
    const userId = result.insertedId;

    const session = await this.lucia.createSession(result.insertedId, {});
    const sessionCookie = this.lucia.createSessionCookie(session.id);
    return {
      userId,
      sessionCookie,
    };
  }

  async verifyEmail(userId: ObjectId): Promise<Cookie> {
    await this.usersCollection.findOneAndUpdate(
      { _id: userId },
      { $set: { isEmailVerified: true } },
    );

    await this.lucia.invalidateUserSessions(userId);
    const session = await this.lucia.createSession(userId, {});

    return this.lucia.createSessionCookie(session.id);
  }
}

declare module "lucia" {
  interface Register {
    Lucia: MyLucia;
    UserId: ObjectId;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
