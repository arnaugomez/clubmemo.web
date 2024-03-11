import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { Lucia, RegisteredDatabaseUserAttributes } from "lucia";
import { Collection, ObjectId } from "mongodb";
import { mongoClient } from "./mongo";

type AuthType = "email"; // | "google"

interface SessionDoc {
  expires_at: Date;
  user_id: ObjectId
}

export interface UserDoc extends RegisteredDatabaseUserAttributes {}

const db = mongoClient.db();
export const sessionsCollection = db.collection<SessionDoc>("sessions");
export const usersCollection = db.collection<UserDoc>("users");

const adapter = new MongodbAdapter(
  sessionsCollection as unknown as Collection<SessionDoc & { _id: string }>,
  usersCollection as unknown as Collection<UserDoc & { _id: ObjectId }>
);

export const lucia = new Lucia(adapter, {
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

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    UserId: ObjectId;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
  hashed_password: string;
  authTypes: AuthType[];
  isEmailVerified?: boolean;
}
